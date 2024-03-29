import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SignupValidation } from '@/lib/validation'
import Loader from '@/components/shared/Loader'
import { Link, useNavigate } from 'react-router-dom'
// import { createUserAccount } from '@/lib/appwrite/api'
import { useToast } from '@/components/ui/use-toast'
import {
  useCreateUserAccount,
  useSignInAccount,
} from '@/lib/react-queries/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'

const SignupForm = () => {
  const { toast } = useToast()
  const { checkAuthUser } = useUserContext()
  const navigate = useNavigate()
  const { mutateAsync: signInAccount } = useSignInAccount()
  const {
    mutateAsync: createUserAccount,
    isPending: isCreatingUser,
  } = useCreateUserAccount()

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const newUser = await createUserAccount(values)
    if (!newUser) {
      return toast({ title: 'Sign up failed, Please try again!' })
    }
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    })

    if (!session) {
      return toast({ title: 'Sign up failed, Please try again!' })
    }
    const isLoggedIn = await checkAuthUser()
    if (isLoggedIn) {
      form.reset()
      navigate('/')
    } else {
      return toast({ title: 'Sign up failed, Please try again!' })
    }
  }

  return (
    <Form {...form}>
      <div className="flex-col sm:w-420 flex-center">
        <div className="flex items-center justify-between gap-2">
          <img
            src="/assets/images/stanfits.svg"
            alt="logo"
            width={40}
            height={40}
          />
          <h3>STANFITS SNAP</h3>
        </div>

        <h2 className="pt-3 h3-bold md:h2-bold sm:pt-5">
          Create a new account
        </h2>
        <p className="mt-2 text-light-3 small-medium md:base-regular">
          To use STANFITS SNAP, Please enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-5 mt-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="shad-button_primary">
            {isCreatingUser ? (
              <div className="gap-2 flex-center">
                <Loader />
                Loading...
              </div>
            ) : (
              'Sign Up'
            )}
          </Button>

          <p className="mt-2 text-center text-small-regular text-light-2">
            Already have an account?
            <Link
              to="/sign-in"
              className="ml-1 text-primary-500 text-small-semibold"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm
