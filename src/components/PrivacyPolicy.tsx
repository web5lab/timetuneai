import React from 'react';
import { Shield, Lock, Eye, Database, UserCheck, Mail, Phone, Globe, Calendar, Trash2, Download } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const PrivacyPolicy: React.FC = () => {
  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        "Account information (email address, name)",
        "Reminder content and scheduling data",
        "Device information and app usage analytics",
        "Voice recordings (processed locally, not stored)",
        "Calendar integration data (when enabled)"
      ]
    },
    {
      icon: Lock,
      title: "How We Use Your Information",
      content: [
        "Provide and improve our reminder services",
        "Sync your data across devices",
        "Send you important service notifications",
        "Analyze app performance and user experience",
        "Provide customer support when requested"
      ]
    },
    {
      icon: Shield,
      title: "Data Protection",
      content: [
        "All data is encrypted in transit and at rest",
        "We use industry-standard security measures",
        "Regular security audits and updates",
        "Limited access to personal data by our team",
        "No sharing of personal data with third parties"
      ]
    },
    {
      icon: Eye,
      title: "Your Privacy Rights",
      content: [
        "Access your personal data at any time",
        "Request correction of inaccurate information",
        "Delete your account and all associated data",
        "Export your data in a portable format",
        "Opt-out of non-essential communications"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-orange-200 mb-6">
              <Shield className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">Privacy Policy</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Your Privacy <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Matters</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              We're committed to protecting your privacy and being transparent about how we handle your data.
            </p>
            
            <div className="mt-6 text-sm text-gray-500">
              Last updated: January 15, 2025
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
            <a 
              href="/request-data" 
              className="group p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-100 hover:border-orange-300 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Download className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Request Your Data</h3>
              </div>
              <p className="text-sm text-gray-600">Download a copy of all your personal data</p>
            </a>
            
            <a 
              href="/request-delete" 
              className="group p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-100 hover:border-orange-300 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Delete Your Data</h3>
              </div>
              <p className="text-sm text-gray-600">Request permanent deletion of your account</p>
            </a>
            
            <a 
              href="mailto:privacy@timetuneai.com" 
              className="group p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-100 hover:border-orange-300 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Contact Us</h3>
              </div>
              <p className="text-sm text-gray-600">Have questions about your privacy?</p>
            </a>
          </div>

          {/* Main Content */}
          <div className="space-y-12">
            {sections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-100">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                  </div>
                  
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            {/* Additional Sections */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Globe className="w-6 h-6 text-orange-500 mr-3" />
                Data Retention
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  We retain your personal data only as long as necessary to provide our services and comply with legal obligations:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Account Data:</strong> Retained while your account is active</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Reminder Data:</strong> Deleted 30 days after account deletion</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Analytics Data:</strong> Anonymized and retained for up to 2 years</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <UserCheck className="w-6 h-6 text-orange-500 mr-3" />
                Children's Privacy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                TimeTuneAI is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Calendar className="w-6 h-6 text-orange-500 mr-3" />
                Changes to This Policy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date. We encourage you to review this privacy policy periodically for any changes.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Phone className="w-6 h-6 mr-3" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Privacy Questions</h3>
                  <p className="opacity-90">privacy@timetuneai.com</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Data Protection Officer</h3>
                  <p className="opacity-90">dpo@timetuneai.com</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">General Support</h3>
                  <p className="opacity-90">support@timetuneai.com</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Mailing Address</h3>
                  <p className="opacity-90">
                    TimeTuneAI Inc.<br />
                    123 Privacy Street<br />
                    San Francisco, CA 94105
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;