# Zolid-form

Awful name, but it is an extremely simple form library for Solidjs with zod validation.

Here is a basic example:

```tsx
// I'm using tailwind with the @tailwindcss/forms plugin
import { Show } from "solid-js";
import { z } from "zod";
import { createForm } from "@juancortelezzi/zolid-form";

// Create a schema
const schema = z.object({
  email: z.string().email(),
  pass: z
    .string()
    .min(1, { message: "this field is required" })
    .max(80, { message: "80 chars max" }),
  age: z
    .number()
    .min(13, { message: "13+ why not?" })
    .max(200, { message: "How are you that old????" }),
});

export default function Home() {
  // use the schema and pass initial values for the required fields
  const form = createForm(schema, {
    email: "",
    pass: "",
    age: 0,
  });

  return (
    <main class="mx-auto max-w-xl p-4">
      <form
        class="space-y-4"
        onSubmit={form.handleSubmit((data) => console.log(data))}
      >
        <div class="flex flex-col gap-2">
          <label for="email">Email:</label>
          <input
            placeholder="Email"
            class="form-input"
            onInput={(e) => {
              // hand the field value to the actualizer
              form.actualizer("email", e.currentTarget.value);
            }}
          />
          {/* 
            Get the field error array and display the first error if existent
          */}
          <Show when={form.errors.email.length > 0}>
            <label for="email" class="text-red-500">
              {form.errors.email[0]}
            </label>
          </Show>
        </div>
        <div class="flex flex-col gap-2">
          <label for="pass">Password:</label>
          <input
            placeholder="Password"
            name="pass"
            type="password"
            class="form-input"
            onInput={(e) => form.actualizer("pass", e.currentTarget.value)}
          />
          <Show when={form.errors.pass.length > 0}>
            <label for="pass" class="text-red-500">
              {form.errors.pass[0]}
            </label>
          </Show>
        </div>
        <div class="flex flex-col gap-2">
          <label for="age">Age:</label>
          <input
            placeholder="Age"
            name="age"
            type="number"
            class="form-input"
            onInput={(e) => {
              // If needed, you can preprocess the field value and then pass it
              // into the actualizer.
              const value = e.currentTarget.value;
              if (value === "") return;
              form.actualizer("age", parseInt(e.currentTarget.value, 10));
            }}
          />
          <Show when={form.errors.age.length > 0}>
            <label for="age" class="text-red-500">
              {form.errors.age[0]}
            </label>
          </Show>
        </div>
        <button
          type="submit"
          class="rounded bg-blue-500 w-full px-1 py-2 font-bold text-black hover:bg-blue-300"
        >
          Submit
        </button>
      </form>
    </main>
  );
}
```
