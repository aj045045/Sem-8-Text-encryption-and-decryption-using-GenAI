from flask import Flask, request, jsonify, send_from_directory
from pathlib import Path
import subprocess, time, random, base64, os
from PIL import Image
import stepic
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP, AES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad, unpad
from werkzeug.utils import secure_filename
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

OUTPUT_DIR = Path("static")
STYLEGAN_SCRIPT = "./stylegan3/gen_images.py"
NETWORK_PICKLE = "./network-snapshot-000000.pkl"


def aes_encrypt(message: str, key: bytes) -> bytes:
    cipher = AES.new(key, AES.MODE_CBC)
    ct_bytes = cipher.encrypt(pad(message.encode(), AES.block_size))
    return cipher.iv + ct_bytes

def aes_decrypt(ciphertext: bytes, key: bytes) -> str:
    iv = ciphertext[:AES.block_size]
    ct = ciphertext[AES.block_size:]
    cipher = AES.new(key, AES.MODE_CBC, iv)
    return unpad(cipher.decrypt(ct), AES.block_size).decode()


@app.route("/encrypt", methods=["POST"])
def encrypt_message_to_images():
    data = request.get_json()
    message = data.get("message", "")
    if not message:
        return jsonify({"error": "No message provided"}), 400

    # Generate images using StyleGAN
    seed_start = random.randint(1, 10000)
    seed_range = f"{seed_start}-{seed_start + 1}"
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for file in OUTPUT_DIR.glob("*.png"):
        try:
            file.unlink()
        except Exception as e:
            return jsonify({"error": f"Failed to delete {file.name}: {str(e)}"}), 500

    run_start = time.time()
    cmd = [
        "python", STYLEGAN_SCRIPT,
        "--outdir", str(OUTPUT_DIR),
        "--trunc", "1.0",
        "--seeds", seed_range,
        "--network", NETWORK_PICKLE
    ]
    try:
        subprocess.run(cmd, check=True)
    except subprocess.CalledProcessError as err:
        return jsonify({"error": str(err)}), 500

    new_pngs = sorted(
        p for p in OUTPUT_DIR.glob("*.png")
        if p.stat().st_mtime >= run_start
    )
    if len(new_pngs) < 2:
        return jsonify({"error": "Expected 2 images but got less."}), 500

    # Hybrid encryption (AES + RSA)
    key = RSA.generate(2048)
    private_key_pem = key.export_key().decode()
    public_key_pem = key.publickey().export_key().decode()

    aes_key = get_random_bytes(32)
    encrypted_message = aes_encrypt(message, aes_key)
    encrypted_aes_key = PKCS1_OAEP.new(key.publickey()).encrypt(aes_key)

    separator = b'---SPLIT---'
    data_img1 = encrypted_aes_key + separator + public_key_pem.encode()
    data_img2 = encrypted_message + separator + private_key_pem.encode()

    # Hide into images
    img1 = Image.open(new_pngs[0])
    img2 = Image.open(new_pngs[1])
    encoded_img1 = stepic.encode(img1, data_img1)
    encoded_img2 = stepic.encode(img2, data_img2)
    encoded_img1.save(new_pngs[0])
    encoded_img2.save(new_pngs[1])

    with open(new_pngs[0], "rb") as f:
        encoded_base64 = base64.b64encode(f.read()).decode()

    return jsonify({
        "display": encoded_base64,
        "download": f"/download/{new_pngs[1].name}"
    })


@app.route("/download/<path:filename>")
def download_image(filename):
    return send_from_directory(OUTPUT_DIR, filename, as_attachment=True)


@app.route("/decrypt", methods=["POST"])
def decrypt_from_images():
    if "image1" not in request.files or "image2" not in request.files:
        return jsonify({"error": "Both image1 and image2 are required"}), 400

    img1 = request.files["image1"]
    img2 = request.files["image2"]
    img1_path = OUTPUT_DIR / secure_filename("decode_img1.png")
    img2_path = OUTPUT_DIR / secure_filename("decode_img2.png")
    img1.save(img1_path)
    img2.save(img2_path)

    try:
        decoded1_bytes = stepic.decode(Image.open(img1_path)).encode('latin-1')
        decoded2_bytes = stepic.decode(Image.open(img2_path)).encode('latin-1')

        separator = b'---SPLIT---'
        split1 = decoded1_bytes.split(separator)
        split2 = decoded2_bytes.split(separator)
        if len(split1) != 2 or len(split2) != 2:
            return jsonify({"error": "Split failed"}), 400

        encrypted_aes_key = split1[0]
        extracted_public_key = split1[1].decode()
        encrypted_message = split2[0]
        extracted_private_key = split2[1].decode()

        private_key = RSA.import_key(extracted_private_key)
        aes_key = PKCS1_OAEP.new(private_key).decrypt(encrypted_aes_key)
        message = aes_decrypt(encrypted_message, aes_key)

        return jsonify({"decrypted_message": message})

    except Exception as e:
        return jsonify({"error": f"Decryption failed: {str(e)}"}), 500
    finally:
        os.remove(img1_path)
        os.remove(img2_path)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)