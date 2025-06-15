from flask import Flask, request, jsonify, send_from_directory
from pathlib import Path
import subprocess, time, random, base64
from PIL import Image
import stepic
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
from werkzeug.utils import secure_filename
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Config
OUTPUT_DIR = Path("static")
STYLEGAN_SCRIPT = "./stylegan3/gen_images.py"
NETWORK_PICKLE = "./network-snapshot-000000.pkl"


@app.route("/encrypt", methods=["POST"])
def encrypt_message_to_images():
    data = request.get_json()
    message = data.get("message", "")
    if not message:
        return jsonify({"error": "No message provided"}), 400
    if len(message) > 1000:
        return jsonify({"error": "Message too long, max 1000 characters"}), 400

    # Step 0: Generate images with StyleGAN
    seed_start = random.randint(1, 10000)
    seed_end = seed_start + 1
    trunc = 1.0
    seed_range = f"{seed_start}-{seed_end}"

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
        "--trunc", str(trunc),
        "--seeds", seed_range,
        "--network", NETWORK_PICKLE,
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

    # Step 1: RSA encryption
    key = RSA.generate(2048)
    private_key_pem = key.export_key().decode()
    public_key_pem = key.publickey().export_key().decode()

    cipher_encrypt = PKCS1_OAEP.new(RSA.import_key(public_key_pem))
    encrypted_message = cipher_encrypt.encrypt(message.encode())

    # Prepare data with separator
    separator = b'---SPLIT---'
    data_img1 = encrypted_message + separator + public_key_pem.encode()
    data_img2 = private_key_pem.encode()

    # Step 2: Hide data into images
    img1 = Image.open(new_pngs[0])
    img2 = Image.open(new_pngs[1])

    encoded_img1 = stepic.encode(img1, data_img1)
    encoded_img2 = stepic.encode(img2, data_img2)

    encoded_img1.save(new_pngs[0])
    encoded_img2.save(new_pngs[1])
    print(f"🔐 Encrypted data saved in {new_pngs[0].name} and {new_pngs[1].name}")

    # Step 3: Return response
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

    # Save uploaded images temporarily
    img1 = request.files["image1"]
    img2 = request.files["image2"]
    
    img1_path = OUTPUT_DIR / secure_filename("decode_img1.png")
    img2_path = OUTPUT_DIR / secure_filename("decode_img2.png")
    img1.save(img1_path)
    img2.save(img2_path)

    try:
        # Decode hidden data
        decoded1 = stepic.decode(Image.open(img1_path))
        decoded2 = stepic.decode(Image.open(img2_path))

        # Convert to bytes
        decoded1_bytes = decoded1.encode('latin-1')
        decoded2_bytes = decoded2.encode('latin-1')

        # Separate encrypted message and public key
        separator = b'---SPLIT---'
        split_data = decoded1_bytes.split(separator)
        if len(split_data) != 2:
            return jsonify({"error": "Failed to split data from image1"}), 400

        encrypted_msg = split_data[0]
        extracted_public_key = split_data[1].decode('utf-8')
        extracted_private_key = decoded2_bytes.decode('utf-8')

        # Decrypt the message
        private_key = RSA.import_key(extracted_private_key)
        cipher_decrypt = PKCS1_OAEP.new(private_key)
        decrypted_message = cipher_decrypt.decrypt(encrypted_msg).decode()

        return jsonify({
            "decrypted_message": decrypted_message,
        })

    except Exception as e:
        return jsonify({"error": f"Decryption failed: {str(e)}"}), 500

    finally:
        # Clean up temporary files
        os.remove(img1_path)
        os.remove(img2_path)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
