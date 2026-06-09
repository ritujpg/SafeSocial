import { Link } from 'react-router-dom';
import { Shield, CheckCircle, ArrowRight, BarChart3, Users, AlertTriangle, Search, Eye, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-white">
      {/* Navigation */}
      <nav className="border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">SafeSocial</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight">
              Detect & Investigate Harmful Social Media Activities
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              SafeSocial is a comprehensive Social Media Monitoring and Investigation Platform designed to detect fake accounts, cyberbullying, threats, image misuse, and suspicious online activities.
            </p>
            <div className="flex gap-4">
              <Link to="/register">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  Login
                </Button>
              </Link>
            </div>
          </div>

          {/* Dashboard Preview Illustration */}
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-8 border border-border">
            <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
              <div className="h-3 w-24 bg-primary rounded-full" />
              <div className="space-y-3">
                <div className="h-2 w-full bg-muted rounded" />
                <div className="h-2 w-3/4 bg-muted rounded" />
                <div className="h-2 w-1/2 bg-muted rounded" />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="h-16 bg-primary/10 rounded-lg border border-primary/20" />
                <div className="h-16 bg-secondary/10 rounded-lg border border-secondary/20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-8 py-20 border-t border-border">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Comprehensive Detection Features
          </h2>
          <p className="text-muted-foreground text-lg">
            Advanced tools to identify and investigate suspicious online activities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="rounded-lg border border-border bg-white p-8 hover:shadow-md transition-shadow">
            <div className="rounded-lg bg-red-100 w-12 h-12 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Fake Account Detection</h3>
            <p className="text-muted-foreground">Identify fraudulent accounts with automated detection and behavioral analysis.</p>
          </div>

          <div className="rounded-lg border border-border bg-white p-8 hover:shadow-md transition-shadow">
            <div className="rounded-lg bg-orange-100 w-12 h-12 flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Cyberbullying Detection</h3>
            <p className="text-muted-foreground">Detect harassment and abusive messages targeting users across the platform.</p>
          </div>

          <div className="rounded-lg border border-border bg-white p-8 hover:shadow-md transition-shadow">
            <div className="rounded-lg bg-red-100 w-12 h-12 flex items-center justify-center mb-4">
              <Eye className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Threat Detection</h3>
            <p className="text-muted-foreground">Monitor and escalate threats with real-time keyword analysis and risk assessment.</p>
          </div>

          <div className="rounded-lg border border-border bg-white p-8 hover:shadow-md transition-shadow">
            <div className="rounded-lg bg-teal-100 w-12 h-12 flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Image Misuse Monitoring</h3>
            <p className="text-muted-foreground">Track unauthorized use of images and detect duplicate content across networks.</p>
          </div>

          <div className="rounded-lg border border-border bg-white p-8 hover:shadow-md transition-shadow">
            <div className="rounded-lg bg-purple-100 w-12 h-12 flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Investigation Dashboard</h3>
            <p className="text-muted-foreground">Comprehensive workspace for digital investigations with timeline reconstruction.</p>
          </div>

          <div className="rounded-lg border border-border bg-white p-8 hover:shadow-md transition-shadow">
            <div className="rounded-lg bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Reports & Analytics</h3>
            <p className="text-muted-foreground">Generate detailed reports and analyze trends to improve safety measures.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-8 py-20 border-t border-border">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            How SafeSocial Works
          </h2>
          <p className="text-muted-foreground text-lg">
            A streamlined process for detecting and investigating harmful activities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { step: '1', title: 'Collect Activity Data', desc: 'Monitor social media activities in real-time' },
            { step: '2', title: 'Analyze Behavior', desc: 'Examine user patterns and interactions' },
            { step: '3', title: 'Detect Threats', desc: 'Identify suspicious and harmful activities' },
            { step: '4', title: 'Generate Alerts', desc: 'Create actionable alerts for investigation' },
            { step: '5', title: 'Investigate', desc: 'Deep-dive analysis and case resolution' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-bold text-lg mb-4">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-8 py-20 border-t border-border">
        <div className="rounded-xl bg-gradient-to-r from-primary to-secondary p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Protect Your Platform?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Start monitoring and investigating suspicious activities today.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white mt-20">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-foreground">SafeSocial</span>
              </div>
              <p className="text-sm text-muted-foreground">
                A comprehensive platform for social media monitoring and investigation.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <p className="text-center text-sm text-muted-foreground">
              © 2024 SafeSocial. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
