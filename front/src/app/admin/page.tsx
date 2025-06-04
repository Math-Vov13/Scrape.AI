"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ProtectedRoute from '../../components/ProtectedRoute';
import {
  Settings,
  Users,
  FileText,
  MessageSquare,
  BarChart3,
  ArrowLeft,
  Upload,
  Download,
  Trash2,
  Eye,
  Search,
  Building2,
  Wrench,
  Edit,
  Save,
  X,
  Plus,
  Code,
  Info,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  RefreshCw,
  UserCheckIcon,
  UserCogIcon,
  UserMinus,
  UsersRoundIcon,
  FileSpreadsheetIcon,
  FileStackIcon,
  CompassIcon
} from 'lucide-react';
import { FetchUsers } from './handleUsers';
import { FetchFiles } from './handleFiles';
import { FetchCompany } from './handleCompany';
import { FetchTools } from './handleTools';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  lastLogin: string;
  status: 'active' | 'inactive';
}

interface File {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  status: 'processing' | 'ready' | 'error';
}

interface Conversation {
  id: string;
  user: string;
  messages: number;
  lastMessage: string;
  date: string;
}

interface Company {
  id: string;
  name: string;
  description: string;
  industry: string;
  employeeCount: number;
  foundedYear: number;
  address: string;
  phone: string;
  email: string;
  website: string;
  services: string[];
  departments: string[];
}

interface ToolParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  enum?: string[];
}

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  parameters: ToolParameter[];
  examples: string[];
  usage_count: number;
  last_used: string;
  status: 'active' | 'inactive' | 'deprecated';
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'files' | 'conversations' | 'stats' | 'company' | 'tools'>('users');
  const [loading, setLoading] = useState(true);
  const [errorMess, setErrorMess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: '1', user: 'user1', messages: 15, lastMessage: 'Merci pour ces informations', date: '2025-05-31 14:25' },
    { id: '2', user: 'user2', messages: 8, lastMessage: 'Peux-tu analyser ce document ?', date: '2025-05-31 11:30' },
    { id: '3', user: 'admin', messages: 23, lastMessage: 'Configuration terminée', date: '2025-05-30 16:45' },
  ]);

  // Mock company data
  const [company, setCompany] = useState<Company>({} as Company)
  // {
  //   id: '1',
  //   name: 'ScrapeAI Technologies',
  //   description: 'Une entreprise innovante spécialisée dans l\'intelligence artificielle et l\'automatisation des processus de données.',
  //   industry: 'Technologie / Intelligence Artificielle',
  //   employeeCount: 150,
  //   foundedYear: 2020,
  //   address: '123 Avenue de l\'Innovation, 75001 Paris, France',
  //   phone: '+33 1 23 45 67 89',
  //   email: 'contact@scrapeai.com',
  //   website: 'https://www.scrapeai.com',
  //   services: [
  //     'Scraping de données web',
  //     'Analyse de données par IA',
  //     'Automatisation de processus',
  //     'Consultation en IA',
  //     'Solutions personnalisées'
  //   ],
  //   departments: [
  //     'Développement',
  //     'Data Science',
  //     'Marketing',
  //     'Ventes',
  //     'Support Client',
  //     'Ressources Humaines',
  //     'Finance'
  //   ]
  // });

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    totalFiles: files.length,
    totalConversations: conversations.length,
    storageUsed: '45.2 GB',
    apiCalls: '1,247'
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErrorMess(null);

      try {
        switch (activeTab) {
          case 'users':
            const resp = await FetchUsers();
            if (resp.success) {
              setUsers(resp.message);
            } else {
              setErrorMess(resp.error || 'Erreur lors de la récupération des utilisateurs');
            }
            break;
          case 'files':
            const resp2 = await FetchFiles();
            if (resp2.success) {
              setFiles(resp2.message);
            } else {
              setErrorMess(resp2.error || 'Erreur lors de la récupération des files');
            }
            break;
          case 'conversations':
            // Conversations are static, no API call needed
            break;
          case 'company':
            const resp3 = await FetchCompany();
            if (resp3.success) {
              setCompany(resp3.message);
            } else {
              setErrorMess(resp3.error || 'Erreur lors de la récupération de l\'entreprise');
            }
            break;
          case 'tools':
            const resp4 = await FetchTools();
            if (resp4.success) {
              setTools(resp4.message as Tool[]); // Use mock data if API fails
            } else {
              setErrorMess(resp4.error || 'Erreur lors de la récupération des tools');
            }
            break;
          case 'stats':
            // Stats are static, no API call needed

            break;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredConversations = conversations.filter(conv =>
    conv.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCompanyUpdate = async () => {
    try {
      const response = await fetch('/api/admin/company', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(company),
      });

      if (!response.ok) throw new Error('Failed to update company data');

      setIsEditingCompany(false);
      console.log('Company updated:', company);
    } catch (error) {
      setErrorMess(error instanceof Error ? error.message : 'Error updating company data');
    }
  };

  const addArrayItem = (field: keyof Company, value: string) => {
    if (value.trim()) {
      setCompany(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()]
      }));
    }
  };

  const removeArrayItem = (field: keyof Company, index: number) => {
    setCompany(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };


  return (
    <ProtectedRoute validateAdmin={true}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/chat" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Chat</span>
                </Link>
              </Button>
              <h1 className="text-2xl font-bold">Scrape.AI Administration</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Admin Panel</span>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 border-r border-border bg-card p-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                  }`}
              >
                <Users className="h-5 w-5" />
                <span>Users</span>
              </button>
              <button
                onClick={() => setActiveTab('files')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'files' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                  }`}
              >
                <FileText className="h-5 w-5" />
                <span>Files</span>
              </button>
              <button
                onClick={() => setActiveTab('conversations')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'conversations' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                  }`}
              >
                <MessageSquare className="h-5 w-5" />
                <span>Conversations</span>
              </button>
              <button
                onClick={() => setActiveTab('company')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'company' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                  }`}
              >
                <Building2 className="h-5 w-5" />
                <span>Company</span>
              </button>
              <button
                onClick={() => setActiveTab('tools')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'tools' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                  }`}
              >
                <Wrench className="h-5 w-5" />
                <span>AI Tools</span>
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'stats' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                  }`}
              >
                <BarChart3 className="h-5 w-5" />
                <span>Statistics</span>
              </button>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-6">
            {/* Search bar */}
            {activeTab !== 'stats' && activeTab !== 'company' && (
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMess && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <X className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-red-800">{errorMess}</span>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              </div>
            )}

            {/* Content based on active tab */}
            {!loading && activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">User Management</h2>
                  <Button>
                    <Users className="h-4 w-4 mr-2" />
                    New User
                  </Button>
                </div>
                <div className="bg-card rounded-lg border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b">
                        <tr className="text-left">
                          <th className="p-4">User</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Role</th>
                          <th className="p-4">Last Login</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b">
                            <td className="p-4 font-medium">{user.username}</td>
                            <td className="p-4 text-muted-foreground">{user.email}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'Admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="p-4 text-muted-foreground">{user.lastLogin}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                {user.status === 'active' ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {!loading && filteredUsers.length === 0 && (
                  <div className="text-center py-12">
                    <UsersRoundIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No users found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery ? 'No user accounts matches your search.' : 'You haven\'t created a user yet!'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {!loading && activeTab === 'files' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">File Management</h2>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                </div>
                <div className="bg-card rounded-lg border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b">
                        <tr className="text-left">
                          <th className="p-4">File Name</th>
                          <th className="p-4">Type</th>
                          <th className="p-4">Size</th>
                          <th className="p-4">Upload Date</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredFiles.map((file) => (
                          <tr key={file.id} className="border-b">
                            <td className="p-4 font-medium">{file.name}</td>
                            <td className="p-4 text-muted-foreground">{file.type}</td>
                            <td className="p-4 text-muted-foreground">{file.size}</td>
                            <td className="p-4 text-muted-foreground">{file.uploadDate}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${file.status === 'ready' ? 'bg-green-100 text-green-800' :
                                file.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                {file.status === 'ready' ? 'Ready' :
                                  file.status === 'processing' ? 'Processing' : 'Error'}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {!loading && filteredFiles.length === 0 && (
                  <div className="text-center py-12">
                    <FileStackIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No files found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery ? 'No file name matches your search.' : "You haven't uploaded any files yet."}
                    </p>
                  </div>
                )}
              </div>
            )}

            {!loading && activeTab === 'conversations' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Conversation History</h2>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
                <div className="bg-card rounded-lg border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b">
                        <tr className="text-left">
                          <th className="p-4">User</th>
                          <th className="p-4">Messages</th>
                          <th className="p-4">Last Message</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredConversations.map((conv) => (
                          <tr key={conv.id} className="border-b">
                            <td className="p-4 font-medium">{conv.user}</td>
                            <td className="p-4 text-muted-foreground">{conv.messages}</td>
                            <td className="p-4 text-muted-foreground max-w-xs truncate">{conv.lastMessage}</td>
                            <td className="p-4 text-muted-foreground">{conv.date}</td>
                            <td className="p-4">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {!loading && activeTab === 'company' && (
              <div>
                {company.id ? (
                <><div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Company Information</h2>
                    <div className="flex space-x-2">
                      {isEditingCompany ? (
                        <>
                          <Button onClick={handleCompanyUpdate} className="bg-green-600 hover:bg-green-700">
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button variant="outline" onClick={() => setIsEditingCompany(false)}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => setIsEditingCompany(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </div><div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* General Information */}
                      <div className="bg-card p-6 rounded-lg border">
                        <div className="flex items-center space-x-2 mb-4">
                          <Building2 className="h-5 w-5 text-blue-500" />
                          <h3 className="text-lg font-semibold">General Information</h3>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Company Name</label>
                            {isEditingCompany ? (
                              <Input
                                value={company.name}
                                onChange={(e) => setCompany(prev => ({ ...prev, name: e.target.value }))}
                                className="mt-1" />
                            ) : (
                              <p className="mt-1 font-medium">{company.name}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Description</label>
                            {isEditingCompany ? (
                              <Textarea
                                value={company.description}
                                onChange={(e: { target: { value: any; }; }) => setCompany(prev => ({ ...prev, description: e.target.value }))}
                                className="mt-1"
                                rows={3} />
                            ) : (
                              <p className="mt-1">{company.description}</p>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Industry</label>
                              {isEditingCompany ? (
                                <Input
                                  value={company.industry}
                                  onChange={(e) => setCompany(prev => ({ ...prev, industry: e.target.value }))}
                                  className="mt-1" />
                              ) : (
                                <p className="mt-1">{company.industry}</p>
                              )}
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Employee Count</label>
                              {isEditingCompany ? (
                                <Input
                                  type="number"
                                  value={company.employeeCount}
                                  onChange={(e) => setCompany(prev => ({ ...prev, employeeCount: parseInt(e.target.value) }))}
                                  className="mt-1" />
                              ) : (
                                <p className="mt-1">{company.employeeCount}</p>
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Founded Year</label>
                            {isEditingCompany ? (
                              <Input
                                type="number"
                                value={company.foundedYear}
                                onChange={(e) => setCompany(prev => ({ ...prev, foundedYear: parseInt(e.target.value) }))}
                                className="mt-1" />
                            ) : (
                              <p className="mt-1 flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                {company.foundedYear}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Contact */}
                      <div className="bg-card p-6 rounded-lg border">
                        <div className="flex items-center space-x-2 mb-4">
                          <Phone className="h-5 w-5 text-green-500" />
                          <h3 className="text-lg font-semibold">Contact</h3>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Address</label>
                            {isEditingCompany ? (
                              <Textarea
                                value={company.address}
                                onChange={(e: { target: { value: any; }; }) => setCompany(prev => ({ ...prev, address: e.target.value }))}
                                className="mt-1"
                                rows={2} />
                            ) : (
                              <p className="mt-1 flex items-start">
                                <MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                                {company.address}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Phone</label>
                            {isEditingCompany ? (
                              <Input
                                value={company.phone}
                                onChange={(e) => setCompany(prev => ({ ...prev, phone: e.target.value }))}
                                className="mt-1" />
                            ) : (
                              <p className="mt-1 flex items-center">
                                <Phone className="h-4 w-4 mr-2" />
                                {company.phone}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Email</label>
                            {isEditingCompany ? (
                              <Input
                                type="email"
                                value={company.email}
                                onChange={(e) => setCompany(prev => ({ ...prev, email: e.target.value }))}
                                className="mt-1" />
                            ) : (
                              <p className="mt-1 flex items-center">
                                <Mail className="h-4 w-4 mr-2" />
                                {company.email}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Website</label>
                            {isEditingCompany ? (
                              <Input
                                value={company.website}
                                onChange={(e) => setCompany(prev => ({ ...prev, website: e.target.value }))}
                                className="mt-1" />
                            ) : (
                              <p className="mt-1 flex items-center">
                                <Globe className="h-4 w-4 mr-2" />
                                <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                  {company.website}
                                </a>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Services */}
                      <div className="bg-card p-6 rounded-lg border">
                        <div className="flex items-center space-x-2 mb-4">
                          <Settings className="h-5 w-5 text-purple-500" />
                          <h3 className="text-lg font-semibold">Services</h3>
                        </div>
                        <div className="space-y-2">
                          {company.services.map((service, index) => (
                            <div key={index} className="flex items-center justify-between bg-secondary/50 px-3 py-2 rounded">
                              <span>{service}</span>
                              {isEditingCompany && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeArrayItem('services', index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          {isEditingCompany && (
                            <div className="flex space-x-2">
                              <Input
                                placeholder="New service"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    addArrayItem('services', e.currentTarget.value);
                                    e.currentTarget.value = '';
                                  }
                                } } />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  const input = e.currentTarget.parentElement?.querySelector('input');
                                  if (input) {
                                    addArrayItem('services', input.value);
                                    input.value = '';
                                  }
                                } }
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Departments */}
                      <div className="bg-card p-6 rounded-lg border">
                        <div className="flex items-center space-x-2 mb-4">
                          <Users className="h-5 w-5 text-orange-500" />
                          <h3 className="text-lg font-semibold">Departments</h3>
                        </div>
                        <div className="space-y-2">
                          {company.departments.map((dept, index) => (
                            <div key={index} className="flex items-center justify-between bg-secondary/50 px-3 py-2 rounded">
                              <span>{dept}</span>
                              {isEditingCompany && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeArrayItem('departments', index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          {isEditingCompany && (
                            <div className="flex space-x-2">
                              <Input
                                placeholder="New department"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    addArrayItem('departments', e.currentTarget.value);
                                    e.currentTarget.value = '';
                                  }
                                } } />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  const input = e.currentTarget.parentElement?.querySelector('input');
                                  if (input) {
                                    addArrayItem('departments', input.value);
                                    input.value = '';
                                  }
                                } }
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div></>) : (
                  <div className="text-center py-12">
                    <CompassIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Company found</h3>
                    <p className="text-muted-foreground">
                      { 'Please, fulfill your company data on our WebSite!' }
                    </p>
                  </div>
                )}
              </div>
            )}

            {!loading && activeTab === 'tools' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Available AI Tools</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {tools.length} tools available
                    </span>
                    <Button variant="outline" onClick={() => {
                      setLoading(true);

                      setTimeout(() => {
                        async function fetchTools() {
                          const resp4 = await FetchTools();
                          if (resp4.success) {
                            setTools(resp4.message as Tool[]);
                          } else {
                            setErrorMess(resp4.error || 'Erreur lors de la récupération des tools');
                          }
                          setLoading(false);
                        }
                        fetchTools();
                      }, 1000);
                    }}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading tools...</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredTools.map((tool) => (
                      <div key={tool.id} className="bg-card p-6 rounded-lg border">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Code className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">{tool.name}</h3>
                              <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                                {tool.category}
                              </span>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${tool.status === 'active' ? 'bg-green-100 text-green-800' :
                            tool.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                            {tool.status === 'active' ? 'Actif' :
                              tool.status === 'inactive' ? 'Inactif' : 'Obsolète'}
                          </span>
                        </div>

                        <p className="text-muted-foreground mb-4">{tool.description}</p>

                        {/* Paramètres */}
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Parameters:</h4>
                          <div className="space-y-2">
                            {tool.parameters.map((param, index) => (
                              <div key={index} className="bg-secondary/30 p-3 rounded text-sm">
                                <div className="flex items-center space-x-2 mb-1">
                                  <code className="bg-secondary px-2 py-1 rounded text-xs font-mono">
                                    {param.name}
                                  </code>
                                  <span className="text-xs text-muted-foreground">
                                    {param.type}
                                  </span>
                                  {param.required && (
                                    <span className="text-xs bg-red-100 text-red-800 px-1 rounded">
                                      required
                                    </span>
                                  )}
                                </div>
                                <p className="text-muted-foreground text-xs">{param.description}</p>
                                {param.enum && (
                                  <div className="mt-1">
                                    <span className="text-xs text-muted-foreground">Values: </span>
                                    <code className="text-xs">{param.enum.join(', ')}</code>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Exemples d'usage */}
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Examples of use:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {tool.examples.map((example, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-primary mt-1">•</span>
                                <span>{example}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Statistiques */}
                        <div className="border-t pt-4 flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <span>Used {tool.usage_count} times</span>
                            <span>•</span>
                            <span>Last use: {tool.last_used}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!loading && filteredTools.length === 0 && (
                  <div className="text-center py-12">
                    <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No tool found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery ? 'No tool matches your search.' : 'No tool available at the moment.'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'stats' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">System Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-card p-6 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium">Users</h3>
                    </div>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    <p className="text-sm text-muted-foreground">{stats.activeUsers} active</p>
                  </div>

                  <div className="bg-card p-6 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="h-5 w-5 text-green-500" />
                      <h3 className="font-medium">Files</h3>
                    </div>
                    <p className="text-2xl font-bold">{stats.totalFiles}</p>
                    <p className="text-sm text-muted-foreground">{stats.storageUsed} used</p>
                  </div>

                  <div className="bg-card p-6 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <MessageSquare className="h-5 w-5 text-purple-500" />
                      <h3 className="font-medium">Conversations</h3>
                    </div>
                    <p className="text-2xl font-bold">{stats.totalConversations}</p>
                    <p className="text-sm text-muted-foreground">Today</p>
                  </div>

                  <div className="bg-card p-6 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Wrench className="h-5 w-5 text-cyan-500" />
                      <h3 className="font-medium">AI Tools</h3>
                    </div>
                    <p className="text-2xl font-bold">{tools.length}</p>
                    <p className="text-sm text-muted-foreground">
                      {tools.filter(t => t.status === 'active').length} active
                    </p>
                  </div>

                  <div className="bg-card p-6 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <BarChart3 className="h-5 w-5 text-orange-500" />
                      <h3 className="font-medium">API Calls</h3>
                    </div>
                    <p className="text-2xl font-bold">{stats.apiCalls}</p>
                    <p className="text-sm text-muted-foreground">This month</p>
                  </div>

                  <div className="bg-card p-6 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Settings className="h-5 w-5 text-gray-500" />
                      <h3 className="font-medium">System</h3>
                    </div>
                    <p className="text-2xl font-bold text-green-600">Online</p>
                    <p className="text-sm text-muted-foreground">All services OK</p>
                  </div>

                  <div className="bg-card p-6 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Upload className="h-5 w-5 text-red-500" />
                      <h3 className="font-medium">Storage</h3>
                    </div>
                    <p className="text-2xl font-bold">{stats.storageUsed}</p>
                    <p className="text-sm text-muted-foreground">/ 100 GB</p>
                  </div>

                  <div className="bg-card p-6 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Building2 className="h-5 w-5 text-indigo-500" />
                      <h3 className="font-medium">Company</h3>
                    </div>
                    <p className="text-2xl font-bold">{company.employeeCount || "N/A"}</p>
                    <p className="text-sm text-muted-foreground">employees</p>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div >
    </ProtectedRoute >
  );
}