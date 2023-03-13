import { Show } from "solid-js";
import { z } from "zod";
import { createForm } from "~/signals/createForm";

const schema = z.object({
  email: z.string().email(),
  pass: z
    .string()
    .min(1, { message: "At leas 1 char" })
    .max(80, { message: "80 chars max" }),
  age: z
    .number()
    .min(18, { message: "+18 babyyyy" })
    .max(200, { message: "Really? that old" }),
  time: z.date().default(new Date()),
});

export default function Home() {
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
            onInput={(e) => form.actualizer("email", e.currentTarget.value)}
          />
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
        <div class="flex flex-col gap-2">
          <label for="time">Time:</label>
          <input
            name="time"
            type="time"
            class="form-input"
            onInput={(e) => {
              const value = e.currentTarget.value;
              if (value === "") return;
              const [hour, minute] = value.split(":");
              if (!hour || !minute) return;
              const date = new Date();
              date.setHours(parseInt(hour, 10));
              date.setMinutes(parseInt(minute, 10));
              form.actualizer("time", date);
            }}
          />
          <Show when={form.errors.time.length > 0}>
            <label for="time" class="text-red-500">
              {form.errors.time[0]}
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
