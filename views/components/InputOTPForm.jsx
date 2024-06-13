// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { Button } from './ui/button';
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from './ui/form';
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSlot,
// } from './ui/input-otp';
// import { toast } from './ui/use-toast';

// const FormSchema = z.object({
//   email: z.string().email({ message: 'Invalid email address' }),
//   pin: z.string().min(6, { message: 'Your one-time password must be 6 characters.' }),
// });

// export function InputOTPForm() {
//   const [otpSent, setOtpSent] = useState(false);
//   const form = useForm({
//     resolver: zodResolver(FormSchema),
//     defaultValues: {
//       email: '',
//       pin: '',
//     },
//   });

//   async function sendOTP(email) {
//     try {
//       const response = await fetch('/api/send-otp', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setOtpSent(true);
//         toast({
//           title: 'OTP sent',
//           description: `An OTP has been sent to ${email}.`,
//         });
//       } else {
//         toast({
//           title: 'Error',
//           description: 'Failed to send OTP. Please try again.',
//         });
//       }
//     } catch (error) {
//       toast({
//         title: 'Error',
//         description: 'An error occurred while sending the OTP.',
//       });
//     }
//   }

//   async function onSubmit(data) {
//     if (!otpSent) {
//       await sendOTP(data.email);
//     } else {
//       toast({
//         title: 'You submitted the following values:',
//         description: (
//           <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
//             <code className="text-white">{JSON.stringify(data, null, 2)}</code>
//           </pre>
//         ),
//       });
//     }
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
//         {!otpSent && (
//           <FormField
//             control={form.control}
//             name="email"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Email</FormLabel>
//                 <FormControl>
//                   <Input type="email" placeholder="email@example.com" {...field} />
//                 </FormControl>
//                 <FormDescription>
//                   Enter your email to receive a one-time password.
//                 </FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         )}
//         {otpSent && (
//           <FormField
//             control={form.control}
//             name="pin"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>One-Time Password</FormLabel>
//                 <FormControl>
//                   <InputOTPGroup>
//                     <InputOTP {...field} />
//                     <InputOTPSlot />
//                     <InputOTPSlot />
//                     <InputOTPSlot />
//                     <InputOTPSlot />
//                     <InputOTPSlot />
//                     <InputOTPSlot />
//                   </InputOTPGroup>
//                 </FormControl>
//                 <FormDescription>
//                   Enter the 6-character code sent to your email.
//                 </FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         )}
//         <Button type="submit">
//           {otpSent ? 'Verify OTP' : 'Send OTP'}
//         </Button>
//       </form>
//     </Form>
//   );
// }
