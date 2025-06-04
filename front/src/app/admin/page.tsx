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
  Calendar
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
  mission: string;
  vision: string;
  values: string[];
  policies: string[];
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loadingTools, setLoadingTools] = useState(false);

  // Mock company data
  const [company, setCompany] = useState<Company>({
    id: '1',
    name: 'ScrapeAI Technologies',
    description: 'Une entreprise innovante spécialisée dans l\'intelligence artificielle et l\'automatisation des processus de données.',
    industry: 'Technologie / Intelligence Artificielle',
    employeeCount: 150,
    foundedYear: 2020,
    address: '123 Avenue de l\'Innovation, 75001 Paris, France',
    phone: '+33 1 23 45 67 89',
    email: 'contact@scrapeai.com',
    website: 'https://www.scrapeai.com',
    services: [
      'Scraping de données web',
      'Analyse de données par IA',
      'Automatisation de processus',
      'Consultation en IA',
      'Solutions personnalisées'
    ],
    departments: [
      'Développement',
      'Data Science',
      'Marketing',
      'Ventes',
      'Support Client',
      'Ressources Humaines',
      'Finance'
    ],
    mission: 'Démocratiser l\'accès aux données et à l\'intelligence artificielle pour toutes les entreprises.',
    vision: 'Devenir le leader mondial des solutions d\'IA accessibles et éthiques.',
    values: [
      'Innovation continue',
      'Transparence',
      'Excellence technique',
      'Respect de la vie privée',
      'Collaboration'
    ],
    policies: [
      'Politique de confidentialité',
      'Conditions d\'utilisation',
      'Politique de sécurité des données',
      'Code de conduite',
      'Politique de télétravail'
    ]
  });

  // Mock data for existing sections
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

  // Mock tools data
  const mockTools: Tool[] = [
    {
      id: '1',
      name: 'web_scraper',
      description: 'Scrape content from web pages and extract structured data',
      category: 'Data Collection',
      parameters: [
        { name: 'url', type: 'string', description: 'The URL to scrape', required: true },
        { name: 'selector', type: 'string', description: 'CSS selector for specific elements', required: false },
        { name: 'format', type: 'string', description: 'Output format', required: false, enum: ['json', 'csv', 'xml'] }
      ],
      examples: [
        'Scraper le contenu d\'une page produit e-commerce',
        'Extraire les prix depuis un site concurrent',
        'Collecter des données de contact depuis un annuaire'
      ],
      usage_count: 1247,
      last_used: '2025-06-03 10:30',
      status: 'active'
    },
    {
      id: '2',
      name: 'pdf_analyzer',
      description: 'Analyze PDF documents and extract key information',
      category: 'Document Processing',
      parameters: [
        { name: 'file_path', type: 'string', description: 'Path to the PDF file', required: true },
        { name: 'extract_tables', type: 'boolean', description: 'Whether to extract tables', required: false },
        { name: 'language', type: 'string', description: 'Document language for OCR', required: false, enum: ['fr', 'en', 'es', 'de'] }
      ],
      examples: [
        'Analyser un rapport financier',
        'Extraire des données depuis une facture',
        'Résumer le contenu d\'un contrat'
      ],
      usage_count: 856,
      last_used: '2025-06-03 09:15',
      status: 'active'
    },
    {
      id: '3',
      name: 'email_sender',
      description: 'Send automated emails with templates and attachments',
      category: 'Communication',
      parameters: [
        { name: 'recipient', type: 'string', description: 'Email recipient address', required: true },
        { name: 'subject', type: 'string', description: 'Email subject', required: true },
        { name: 'template', type: 'string', description: 'Email template name', required: false },
        { name: 'attachments', type: 'array', description: 'List of file attachments', required: false }
      ],
      examples: [
        'Envoyer un rapport hebdomadaire automatique',
        'Notifier les clients de nouvelles mises à jour',
        'Envoyer des rappels de paiement'
      ],
      usage_count: 432,
      last_used: '2025-06-02 16:45',
      status: 'active'
    },
    {
      id: '4',
      name: 'data_validator',
      description: 'Validate data quality and consistency across datasets',
      category: 'Data Quality',
      parameters: [
        { name: 'dataset', type: 'string', description: 'Path to the dataset', required: true },
        { name: 'schema', type: 'object', description: 'Validation schema', required: false },
        { name: 'strict_mode', type: 'boolean', description: 'Enable strict validation', required: false }
      ],
      examples: [
        'Vérifier la qualité des données clients',
        'Valider les imports de données',
        'Détecter les anomalies dans les datasets'
      ],
      usage_count: 298,
      last_used: '2025-06-01 14:20',
      status: 'deprecated'
    }
  ];

  // Load tools (simulate API call)
  useEffect(() => {
    if (activeTab === 'tools') {
      setLoadingTools(true);
      // Simulate API call
      setTimeout(() => {
        setTools(mockTools);
        setLoadingTools(false);
      }, 1000);
    }
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

  const handleCompanyUpdate = () => {
    setIsEditingCompany(false);
    // Here you would typically save to backend
    console.log('Company updated:', company);
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
                onClick={() => setActiveTab('company')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'company' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                  }`}
              >
                <Building2 className="h-5 w-5" />
                <span>Entreprise</span>
              </button>
              <button
                onClick={() => setActiveTab('tools')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'tools' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                  }`}
              >
                <Wrench className="h-5 w-5" />
                <span>Tools IA</span>
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
            {activeTab !== 'stats' && activeTab !== 'company' && (
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

            {activeTab === 'company' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Informations de l'Entreprise</h2>
                  <div className="flex space-x-2">
                    {isEditingCompany ? (
                      <>
                        <Button onClick={handleCompanyUpdate} className="bg-green-600 hover:bg-green-700">
                          <Save className="h-4 w-4 mr-2" />
                          Sauvegarder
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditingCompany(false)}>
                          <X className="h-4 w-4 mr-2" />
                          Annuler
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditingCompany(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Informations générales */}
                  <div className="bg-card p-6 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-4">
                      <Building2 className="h-5 w-5 text-blue-500" />
                      <h3 className="text-lg font-semibold">Informations Générales</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Nom de l'entreprise</label>
                        {isEditingCompany ? (
                          <Input
                            value={company.name}
                            onChange={(e) => setCompany(prev => ({ ...prev, name: e.target.value }))}
                            className="mt-1"
                          />
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
                            rows={3}
                          />
                        ) : (
                          <p className="mt-1">{company.description}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Secteur</label>
                          {isEditingCompany ? (
                            <Input
                              value={company.industry}
                              onChange={(e) => setCompany(prev => ({ ...prev, industry: e.target.value }))}
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1">{company.industry}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Nombre d'employés</label>
                          {isEditingCompany ? (
                            <Input
                              type="number"
                              value={company.employeeCount}
                              onChange={(e) => setCompany(prev => ({ ...prev, employeeCount: parseInt(e.target.value) }))}
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1">{company.employeeCount}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Année de création</label>
                        {isEditingCompany ? (
                          <Input
                            type="number"
                            value={company.foundedYear}
                            onChange={(e) => setCompany(prev => ({ ...prev, foundedYear: parseInt(e.target.value) }))}
                            className="mt-1"
                          />
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
                        <label className="text-sm font-medium text-muted-foreground">Adresse</label>
                        {isEditingCompany ? (
                          <Textarea
                            value={company.address}
                            onChange={(e: { target: { value: any; }; }) => setCompany(prev => ({ ...prev, address: e.target.value }))}
                            className="mt-1"
                            rows={2}
                          />
                        ) : (
                          <p className="mt-1 flex items-start">
                            <MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                            {company.address}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
                        {isEditingCompany ? (
                          <Input
                            value={company.phone}
                            onChange={(e) => setCompany(prev => ({ ...prev, phone: e.target.value }))}
                            className="mt-1"
                          />
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
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            {company.email}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Site web</label>
                        {isEditingCompany ? (
                          <Input
                            value={company.website}
                            onChange={(e) => setCompany(prev => ({ ...prev, website: e.target.value }))}
                            className="mt-1"
                          />
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
                            placeholder="Nouveau service"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                addArrayItem('services', e.currentTarget.value);
                                e.currentTarget.value = '';
                              }
                            }}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              const input = e.currentTarget.parentElement?.querySelector('input');
                              if (input) {
                                addArrayItem('services', input.value);
                                input.value = '';
                              }
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Départements */}
                  <div className="bg-card p-6 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-4">
                      <Users className="h-5 w-5 text-orange-500" />
                      <h3 className="text-lg font-semibold">Départements</h3>
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
                            placeholder="Nouveau département"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                addArrayItem('departments', e.currentTarget.value);
                                e.currentTarget.value = '';
                              }
                            }}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              const input = e.currentTarget.parentElement?.querySelector('input');
                              if (input) {
                                addArrayItem('departments', input.value);
                                input.value = '';
                              }
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mission & Vision */}
                  <div className="bg-card p-6 rounded-lg border lg:col-span-2">
                    <div className="flex items-center space-x-2 mb-4">
                      <Info className="h-5 w-5 text-cyan-500" />
                      <h3 className="text-lg font-semibold">Mission & Vision</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Mission</label>
                        {isEditingCompany ? (
                          <Textarea
                            value={company.mission}
                            onChange={(e: { target: { value: any; }; }) => setCompany(prev => ({ ...prev, mission: e.target.value }))}
                            className="mt-1"
                            rows={3}
                          />
                        ) : (
                          <p className="mt-1">{company.mission}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Vision</label>
                        {isEditingCompany ? (
                          <Textarea
                            value={company.vision}
                            onChange={(e: { target: { value: any; }; }) => setCompany(prev => ({ ...prev, vision: e.target.value }))}
                            className="mt-1"
                            rows={3}
                          />
                        ) : (
                          <p className="mt-1">{company.vision}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Valeurs */}
                  <div className="bg-card p-6 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-4">
                      <Building2 className="h-5 w-5 text-red-500" />
                      <h3 className="text-lg font-semibold">Valeurs</h3>
                    </div>
                    <div className="space-y-2">
                      {company.values.map((value, index) => (
                        <div key={index} className="flex items-center justify-between bg-secondary/50 px-3 py-2 rounded">
                          <span>{value}</span>
                          {isEditingCompany && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeArrayItem('values', index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      {isEditingCompany && (
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Nouvelle valeur"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                addArrayItem('values', e.currentTarget.value);
                                e.currentTarget.value = '';
                              }
                            }}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              const input = e.currentTarget.parentElement?.querySelector('input');
                              if (input) {
                                addArrayItem('values', input.value);
                                input.value = '';
                              }
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Politiques */}
                  <div className="bg-card p-6 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-4">
                      <FileText className="h-5 w-5 text-indigo-500" />
                      <h3 className="text-lg font-semibold">Politiques</h3>
                    </div>
                    <div className="space-y-2">
                      {company.policies.map((policy, index) => (
                        <div key={index} className="flex items-center justify-between bg-secondary/50 px-3 py-2 rounded">
                          <span>{policy}</span>
                          {isEditingCompany && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeArrayItem('policies', index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      {isEditingCompany && (
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Nouvelle politique"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                addArrayItem('policies', e.currentTarget.value);
                                e.currentTarget.value = '';
                              }
                            }}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              const input = e.currentTarget.parentElement?.querySelector('input');
                              if (input) {
                                addArrayItem('policies', input.value);
                                input.value = '';
                              }
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tools' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Tools IA Disponibles</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {tools.length} tools disponibles
                    </span>
                    <Button variant="outline" onClick={() => {
                      setLoadingTools(true);
                      setTimeout(() => {
                        setTools(mockTools);
                        setLoadingTools(false);
                      }, 1000);
                    }}>
                      <Download className="h-4 w-4 mr-2" />
                      Actualiser
                    </Button>
                  </div>
                </div>

                {loadingTools ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Chargement des tools...</p>
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
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            tool.status === 'active' ? 'bg-green-100 text-green-800' :
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
                          <h4 className="font-medium mb-2">Paramètres:</h4>
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
                                      requis
                                    </span>
                                  )}
                                </div>
                                <p className="text-muted-foreground text-xs">{param.description}</p>
                                {param.enum && (
                                  <div className="mt-1">
                                    <span className="text-xs text-muted-foreground">Valeurs: </span>
                                    <code className="text-xs">{param.enum.join(', ')}</code>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Exemples d'usage */}
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Exemples d'usage:</h4>
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
                            <span>Utilisé {tool.usage_count} fois</span>
                            <span>•</span>
                            <span>Dernière utilisation: {tool.last_used}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!loadingTools && filteredTools.length === 0 && (
                  <div className="text-center py-12">
                    <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucun tool trouvé</h3>
                    <p className="text-muted-foreground">
                      {searchQuery ? 'Aucun tool ne correspond à votre recherche.' : 'Aucun tool disponible pour le moment.'}
                    </p>
                  </div>
                )}
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
                      <Wrench className="h-5 w-5 text-cyan-500" />
                      <h3 className="font-medium">Tools IA</h3>
                    </div>
                    <p className="text-2xl font-bold">{tools.length}</p>
                    <p className="text-sm text-muted-foreground">
                      {tools.filter(t => t.status === 'active').length} actifs
                    </p>
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

                  <div className="bg-card p-6 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Building2 className="h-5 w-5 text-indigo-500" />
                      <h3 className="font-medium">Entreprise</h3>
                    </div>
                    <p className="text-2xl font-bold">{company.employeeCount}</p>
                    <p className="text-sm text-muted-foreground">employés</p>
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