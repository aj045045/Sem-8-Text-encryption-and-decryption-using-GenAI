import { useForm, UseFormProps, UseFormReturn } from "react-hook-form";
import { ZodType, ZodTypeDef, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod/src/index.js";

/**
 * The function `useZodForm` creates a form hook using a Zod schema for validation in TypeScript.
 * @param {TSchema} schema - The `schema` parameter in the `useZodForm` function is a Zod schema that
 * defines the shape and validation rules for the form data. It is used to create a resolver for form
 * validation.
 * @param [options] - The `options` parameter in the `useZodForm` function is an optional parameter
 * that allows you to provide additional configuration options for the form. It is of type
 * `Omit<UseFormProps<z.infer<TSchema>>, "resolver">`, which means it should include all properties of
 * @returns The `useZodForm` function returns a `UseFormReturn` object with the inferred type from the
 * provided Zod schema. The function uses the `useForm` hook from a form library and sets the resolver
 * to be a Zod resolver created from the provided schema.
 */
export function useZodForm<TSchema extends ZodType<any, ZodTypeDef, any>>(
    schema: TSchema,
    options?: Omit<UseFormProps<z.infer<TSchema>>, "resolver">
): UseFormReturn<z.infer<TSchema>> {
    return useForm<z.infer<TSchema>>({
        resolver: zodResolver(schema),
        ...options,
    });
}
