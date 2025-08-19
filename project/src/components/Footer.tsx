import React from 'react';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H+</span>
              </div>
              <span className="text-xl font-bold">HealthCare+</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted healthcare partner, connecting you with the best medical professionals.
            </p>
            <div className="flex space-x-4">
              <SocialButton icon={Facebook} />
              <SocialButton icon={Twitter} />
              <SocialButton icon={Instagram} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink label="About Us" />
              <FooterLink label="Our Doctors" />
              <FooterLink label="Services" />
              <FooterLink label="Appointments" />
              <FooterLink label="Contact" />
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Specializations</h3>
            <ul className="space-y-2">
              <FooterLink label="Cardiology" />
              <FooterLink label="Dermatology" />
              <FooterLink label="Pediatrics" />
              <FooterLink label="Orthopedics" />
              <FooterLink label="Neurology" />
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <ContactItem icon={Phone} text="+1 (555) 123-4567" />
              <ContactItem icon={Mail} text="info@healthcareplus.com" />
              <ContactItem icon={MapPin} text="123 Medical Center Dr, Health City, HC 12345" />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} HealthCare+. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialButton({ icon: Icon }: { icon: any }) {
  return (
    <button className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200">
      <Icon className="w-5 h-5" />
    </button>
  );
}

function FooterLink({ label }: { label: string }) {
  return (
    <li>
      <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
        {label}
      </a>
    </li>
  );
}

function ContactItem({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <div className="flex items-center space-x-3">
      <Icon className="w-5 h-5 text-blue-400" />
      <span className="text-gray-400">{text}</span>
    </div>
  );
}

export default Footer;