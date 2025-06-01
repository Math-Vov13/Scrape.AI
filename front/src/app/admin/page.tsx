"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Search
} from 'lucide-react';

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

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'files' | 'conversations' | 'stats'>('users');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const users: User[] = [
    { id: '1', username: 'admin', email: 'admin@scrapeai.com', role: 'Admin', lastLogin: '2025-05-31 14:30', status: 'active' },
    { id: '2', username: 'user1', email: 'user1@company.com', role: 'User', lastLogin: '2025-05-31 12:15', status: 'active' },
    { id: '3', username: 'user2', email: 'user2@company.com', role: 'User', lastLogin: '2025-05-30 18:45', status: 'inactive' },
  ];

  const files: File[] = [
    { id: '1', name: 'rapport_q1.pdf', type: 'PDF', size: '2.3 MB', uploadDate: '2025-05-31', status: 'ready' },
    { id: '2', name: 'donnees_clients.xlsx', type: 'Excel', size: '5.7 MB', uploadDate: '2025-05-30', status: 'processing' },
    { id: '3', name: 'presentation.pptx', type: 'PowerPoint', size: '12.1 MB', uploadDate: '2025-05-29', status: 'ready' },
  ];

  const conversations: Conversation[] = [
    { id: '1', user: 'user1', messages: 15, lastMessage: 'Merci pour ces informations', date: '2025-05-31 14:25' },
    { id: '2', user: 'user2', messages: 8, lastMessage: 'Peux-tu analyser ce document ?', date: '2025-05-31 11:30' },
    { id: '3', user: 'admin', messages: 23, lastMessage: 'Configuration terminée', date: '2025-05-30 16:45' },
  ];

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    totalFiles: files.length,
    totalConversations: conversations.length,
    storageUsed: '45.2 GB',
    apiCalls: '1,247'
  };

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
                  <span>Retour au Chat</span>
                </Link>
              </Button>
              <h1 className="text-2xl font-bold">Administration Scrape.AI</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Panel Admin</span>
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
                <span>Utilisateurs</span>
              </button>
              <button
                onClick={() => setActiveTab('files')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'files' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                  }`}
              >
                <FileText className="h-5 w-5" />
                <span>Fichiers</span>
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
                onClick={() => setActiveTab('stats')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'stats' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                  }`}
              >
                <BarChart3 className="h-5 w-5" />
                <span>Statistiques</span>
              </button>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-6">
            {/* Search bar */}
            {activeTab !== 'stats' && (
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            {/* Content based on active tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Gestion des Utilisateurs</h2>
                  <Button>
                    <Users className="h-4 w-4 mr-2" />
                    Nouvel Utilisateur
                  </Button>
                </div>
                <div className="bg-card rounded-lg border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b">
                        <tr className="text-left">
                          <th className="p-4">Utilisateur</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Rôle</th>
                          <th className="p-4">Dernière connexion</th>
                          <th className="p-4">Statut</th>
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
                                {user.status === 'active' ? 'Actif' : 'Inactif'}
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
              </div>
            )}

            {activeTab === 'files' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Gestion des Fichiers</h2>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Uploader un fichier
                  </Button>
                </div>
                <div className="bg-card rounded-lg border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b">
                        <tr className="text-left">
                          <th className="p-4">Nom du fichier</th>
                          <th className="p-4">Type</th>
                          <th className="p-4">Taille</th>
                          <th className="p-4">Date d'upload</th>
                          <th className="p-4">Statut</th>
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
                                {file.status === 'ready' ? 'Prêt' :
                                  file.status === 'processing' ? 'En cours' : 'Erreur'}
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
              </div>
            )}

            {activeTab === 'conversations' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Historique des Conversations</h2>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </div>
                <div className="bg-card rounded-lg border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b">
                        <tr className="text-left">
                          <th className="p-4">Utilisateur</th>
                          <th className="p-4">Messages</th>
                          <th className="p-4">Dernier message</th>
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

            {activeTab === 'stats' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Statistiques du Système</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-card p-6 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium">Utilisateurs</h3>
                    </div>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    <p className="text-sm text-muted-foreground">{stats.activeUsers} actifs</p>
                  </div>

                  <div className="bg-card p-6 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="h-5 w-5 text-green-500" />
                      <h3 className="font-medium">Fichiers</h3>
                    </div>
                    <p className="text-2xl font-bold">{stats.totalFiles}</p>
                    <p className="text-sm text-muted-foreground">{stats.storageUsed} utilisés</p>
                  </div>

                  <div className="bg-card p-6 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <MessageSquare className="h-5 w-5 text-purple-500" />
                      <h3 className="font-medium">Conversations</h3>
                    </div>
                    <p className="text-2xl font-bold">{stats.totalConversations}</p>
                    <p className="text-sm text-muted-foreground">Aujourd'hui</p>
                  </div>

                  <div className="bg-card p-6 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <BarChart3 className="h-5 w-5 text-orange-500" />
                      <h3 className="font-medium">Appels API</h3>
                    </div>
                    <p className="text-2xl font-bold">{stats.apiCalls}</p>
                    <p className="text-sm text-muted-foreground">Ce mois</p>
                  </div>

                  <div className="bg-card p-6 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Settings className="h-5 w-5 text-gray-500" />
                      <h3 className="font-medium">Système</h3>
                    </div>
                    <p className="text-2xl font-bold text-green-600">En ligne</p>
                    <p className="text-sm text-muted-foreground">Tous services OK</p>
                  </div>

                  <div className="bg-card p-6 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Upload className="h-5 w-5 text-red-500" />
                      <h3 className="font-medium">Stockage</h3>
                    </div>
                    <p className="text-2xl font-bold">{stats.storageUsed}</p>
                    <p className="text-sm text-muted-foreground">/ 100 GB</p>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
