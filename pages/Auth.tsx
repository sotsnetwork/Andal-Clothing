import React, { useState } from 'react';
import { Page } from '../types';
import { Button, Input } from '../components/Shared';

interface AuthProps {
  onNavigate: (page: Page, params?: any) => void;
  onLogin?: () => void;
}

export const SignIn: React.FC<AuthProps> = ({ onNavigate, onLogin }) => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to access your royal account</p>
        </div>
        
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); if(onLogin) onLogin(); }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <Input type="email" placeholder="Enter your email" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input type="password" placeholder="Enter your password" required />
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={() => onNavigate(Page.FORGOT_PASSWORD)} className="text-sm text-gray-600 hover:text-black hover:underline">
                Forgot password?
              </button>
            </div>
          </div>
          
          <Button type="submit" className="w-full">Sign In</Button>
          
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button type="button" variant="outline" className="w-full text-sm">Google</Button>
            <Button type="button" variant="outline" className="w-full text-sm">Apple</Button>
          </div>
          
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button type="button" onClick={() => onNavigate(Page.SIGNUP)} className="font-bold text-black hover:underline">
              Sign up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export const SignUp: React.FC<AuthProps> = ({ onNavigate, onLogin }) => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold mb-2">Join Andal Clothing</h1>
          <p className="text-gray-600">Create an account to start your journey</p>
        </div>
        
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); if(onLogin) onLogin(); }}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <Input placeholder="First name" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <Input placeholder="Last name" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <Input type="email" placeholder="Enter your email" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input type="password" placeholder="Create a password" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <Input type="password" placeholder="Confirm your password" required />
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            By signing up, you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>.
          </div>
          
          <Button type="submit" className="w-full">Create Account</Button>
          
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button type="button" onClick={() => onNavigate(Page.LOGIN)} className="font-bold text-black hover:underline">
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export const ForgotPassword: React.FC<AuthProps> = ({ onNavigate }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (isSubmitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-3xl text-green-600">mark_email_read</span>
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">Check Your Email</h1>
            <p className="text-gray-600 mb-6">We have sent a password reset link to your email address.</p>
          </div>
          <Button onClick={() => onNavigate(Page.LOGIN)} className="w-full">Return to Sign In</Button>
          <button onClick={() => setIsSubmitted(false)} className="text-sm text-gray-500 hover:text-black mt-4">
            Didn't receive the email? Click to retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-3xl">lock_reset</span>
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">Forgot Password?</h1>
          <p className="text-gray-600">Enter your email address and we'll send you a link to reset your password.</p>
        </div>
        
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsSubmitted(true); }}>
          <div className="text-left">
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <Input type="email" placeholder="Enter your email" required />
          </div>
          
          <Button type="submit" className="w-full">Send Reset Link</Button>
          
          <button type="button" onClick={() => onNavigate(Page.LOGIN)} className="flex items-center justify-center gap-2 w-full text-sm font-medium text-gray-600 hover:text-black">
            <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export const NewPassword: React.FC<AuthProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold mb-2">Create New Password</h1>
          <p className="text-gray-600">Your new password must be different from previous used passwords.</p>
        </div>
        
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onNavigate(Page.LOGIN); }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <Input type="password" placeholder="Enter new password" required />
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <Input type="password" placeholder="Confirm new password" required />
            </div>
          </div>
          
          <Button type="submit" className="w-full">Reset Password</Button>
        </form>
      </div>
    </div>
  );
};