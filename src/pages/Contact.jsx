import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Send, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import logo from '@/assets/icons/ThreadLogo2.png';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Open email client with pre-filled content
    const mailtoLink = `mailto:podolny.anna@gmail.com?subject=${encodeURIComponent(formData.subject || 'Contact from Thread Doodle')}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`)}`;
    window.location.href = mailtoLink;
    setSubmitted(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Thread Doodle" className="h-10 w-auto" />
          </Link>
          <Link
            to="/design"
            className="px-5 py-2.5 bg-blue-900 text-white rounded-full hover:bg-navy-800 transition-all hover:shadow-lg"
          >
            Start Designing
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-navy-900 mb-4">Get in Touch</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Have questions about your order, need help with a design, or just want to say hello?
            We'd love to hear from you!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8">
              <h2 className="text-2xl font-semibold text-navy-900 mb-6">Contact Information</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-navy-900 mb-1">Email Us</h3>
                    <a
                      href="mailto:podolny.anna@gmail.com"
                      className="text-rose-500 hover:text-rose-600 transition-colors"
                    >
                      podolny.anna@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-navy-900 mb-1">Response Time</h3>
                    <p className="text-gray-600">We typically respond within 24-48 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-navy-900 mb-1">We're Here to Help</h3>
                    <p className="text-gray-600">Questions about orders, designs, or anything else - just ask!</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {submitted ? (
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-navy-900 mb-2">Message Ready!</h2>
                <p className="text-gray-600 mb-6">
                  Your email client should have opened with your message.
                  If it didn't, please email us directly at:
                </p>
                <a
                  href="mailto:podolny.anna@gmail.com"
                  className="text-rose-500 hover:text-rose-600 font-medium"
                >
                  podolny.anna@gmail.com
                </a>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 block w-full py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8">
                <h2 className="text-2xl font-semibold text-navy-900 mb-6">Send a Message</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-cream-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-cream-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-cream-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                      placeholder="Order inquiry, Design help, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 bg-cream-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-blue-900 text-white rounded-xl font-medium hover:bg-navy-800 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Thread Doodle" className="h-8 w-auto" />
          </div>
          <p className="text-gray-500 text-sm">
            © 2024 Thread Doodle. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
