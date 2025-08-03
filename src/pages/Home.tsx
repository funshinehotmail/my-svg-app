import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Plus, FileText, Users, BarChart3 } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleCreatePresentation = () => {
    navigate('/editor');
  };

  const stats = [
    { label: 'Total Presentations', value: '12', icon: FileText },
    { label: 'Team Members', value: '8', icon: Users },
    { label: 'Views This Month', value: '1.2k', icon: BarChart3 },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.email?.split('@')[0] || 'User'}!
        </h1>
        <p className="text-blue-100 mb-6">
          Create stunning presentations with AI-powered visual content generation
        </p>
        <Button
          onClick={handleCreatePresentation}
          className="bg-white text-blue-600 hover:bg-gray-100"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Presentation
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <Card.Content className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>

      {/* Recent Presentations */}
      <Card>
        <Card.Header>
          <Card.Title>Recent Presentations</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate('/editor/1')}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Sample Presentation {item}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Last edited 2 days ago
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Open
                </Button>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default Home;
