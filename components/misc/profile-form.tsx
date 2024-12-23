import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { drizzle } from '@/db';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  age: z.number().min(1, { message: 'Age must be positive' }),
});

export function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      age: undefined,
    },
    resolver: zodResolver(formSchema),
  });

  return (
    <Form {...form}>
      <form
        className="flex w-full items-center justify-center space-x-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Age" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
}

async function onSubmit(values: z.infer<typeof formSchema>) {
  if (values.age) {
    drizzle.users.updateUserAge('1', values.age);
    return true;
  } else {
    return false;
  }
}
