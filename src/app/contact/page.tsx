'use client';

import { useState } from 'react';
import { Mail, Send, CheckCircle, Clock } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-16 space-y-12">
      <header className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs uppercase font-mono tracking-widest text-gold-600 dark:text-gold-400 font-bold">
          Communications Desk
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-gray-950 dark:text-white">
          Contact the Editorial Bureau
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          For confidential tips, syndicate partnerships, press inquiries, or corrections, reach our international correspondents.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Contact Coordinates */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-editorial-cardDark border border-gray-200 dark:border-editorial-cardDarkBorder space-y-4">
            <h3 className="text-base font-serif font-bold text-gray-950 dark:text-white">
              Direct Inquiries
            </h3>
            
            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-start space-x-3 text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-200">Editorial & Press</p>
                  <a href="mailto:contact@birthdayaura.com" className="text-gold-600 dark:text-gold-400 hover:underline">contact@birthdayaura.com</a>
                </div>
              </div>


              <div className="flex items-start space-x-3 text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-200">Response Window</p>
                  <p>Correspondents review inquiries within 24 hours.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Form */}
        <div className="md:col-span-7">
          <div className="p-8 rounded-2xl bg-white dark:bg-editorial-cardDark border border-gray-200 dark:border-editorial-cardDarkBorder">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle className="w-12 h-12 text-gold-500 mx-auto" />
                <h3 className="text-xl font-serif font-bold text-gray-950 dark:text-white">
                  Dispatch Received
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                  Thank you for reaching out. The appropriate editorial desk or correspondent will review your submission promptly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-editorial-subtle text-sm text-gray-900 dark:text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-editorial-subtle text-sm text-gray-900 dark:text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                    Subject / Department
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g., Editorial Submission, Syndication, Corrections"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-editorial-subtle text-sm text-gray-900 dark:text-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-editorial-subtle text-sm text-gray-900 dark:text-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gold-500 text-black text-xs font-bold uppercase tracking-wider hover:bg-gold-400 transition-colors flex items-center justify-center space-x-2 shadow-sm"
                >
                  <span>Transmit Inquiry</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

