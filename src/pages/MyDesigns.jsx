import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Palette, 
  Calendar, 
  ArrowRight,
  Loader2,
  Heart,
  Trash2
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

const API_BASE = "http://localhost:5243";

export default function MyDesigns() {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    try {
      const res = await fetch(`${API_BASE}/designs/user/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setDesigns(data);
      }
    } catch (err) {
      console.error('Fetch designs error:', err);
    } finally {
      setLoading(false);
    }
  };

  const continueDesign = (design) => {
    sessionStorage.setItem('currentDesign', JSON.stringify(design));
    navigate(`/design?designId=${design.id}`);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 lg:p-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-navy-900 mb-2">My Designs</h1>
              <p className="text-gray-500">Your saved pattern designs</p>
            </div>
            <Link
              to="/design"
              className="inline-flex items-center gap-2 px-6 py-3 bg-navy-900 text-white rounded-xl font-medium hover:bg-navy-800 transition-all"
            >
              <Plus className="w-5 h-5" />
              New Design
            </Link>
          </div>

          {designs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
              <Palette className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-navy-900 mb-2">No designs yet</h3>
              <p className="text-gray-500 mb-6">Start creating your first wearable memory</p>
              <Link
                to="/design"
                className="inline-flex items-center gap-2 px-6 py-3 bg-navy-900 text-white rounded-xl font-medium hover:bg-navy-800 transition-all"
              >
                Start Designing
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {designs.map((design, index) => (
                <motion.div
                  key={design.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden group cursor-pointer"
                  onClick={() => continueDesign(design)}
                >
                  <div className="aspect-square bg-gradient-to-br from-rose-100 to-amber-100 relative overflow-hidden">
                    {design.mockupUrl || design.patternUrl ? (
                      <img
                        src={design.mockupUrl || design.patternUrl}
                        alt="Design preview"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Palette className="w-16 h-16 text-rose-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-white font-medium flex items-center gap-2">
                        Continue Editing <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-navy-900 mb-1">{design.name || 'Untitled Design'}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(design.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}