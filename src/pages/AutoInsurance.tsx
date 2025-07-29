import { useState, useEffect } from "react"
import { useDataSync } from '@/hooks/useDataSync'
import { Car, Plus, AlertTriangle, Calendar, Users, Euro, Shield, Save, Printer } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAutoInsurances } from "@/hooks/useAutoInsurances"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface AutoInsurancePolicy {
  id: number
  policy_number: string
  client_name: string
  vehicle_make: string
  vehicle_model: string
  year: number
  license_plate: string
  company: string
  start_date: string
  end_date: string
  premium: number
  status: "active" | "expired" | "pending"
}

// Les polices d'assurance seront générées automatiquement basées sur les données réelles
const generateInsurancePoliciesFromClients = (clients: any[]): AutoInsurancePolicy[] => {
  // Pour l'instant, aucune police d'assurance auto n'est configurée
  // Elles seront ajoutées quand les clients auront des véhicules assurés
  return []
}

// Mock data (sera remplacé par generateInsurancePoliciesFromClients)
const mockAutoInsurances: AutoInsurancePolicy[] = [
  {
    id: 1,
    policy_number: "AUTO001",
    client_name: "Jean Dupont",
    vehicle_make: "Peugeot",
    vehicle_model: "308",
    year: 2020,
    license_plate: "AB-123-CD",
    company: "GMC Assurances",
    start_date: "2024-01-15",
    end_date: "2025-01-15",
    premium: 850000,
    status: "active"
  },
  {
    id: 2,
    policy_number: "AUTO002",
    client_name: "Marie Martin",
    vehicle_make: "Renault",
    vehicle_model: "Clio",
    year: 2019,
    license_plate: "EF-456-GH",
    company: "GMC Assurances",
    start_date: "2024-03-01",
    end_date: "2025-03-01",
    premium: 720000,
    status: "active"
  },
  {
    id: 3,
    policy_number: "AUTO003",
    client_name: "Pierre Durand",
    vehicle_make: "Citroën",
    vehicle_model: "C3",
    year: 2018,
    license_plate: "IJ-789-KL",
    company: "GMC Assurances",
    start_date: "2023-12-01",
    end_date: "2024-12-01",
    premium: 680000,
    status: "expired"
  }
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-success/20 text-success border-success/30">Actif</Badge>
    case "expired":
      return <Badge variant="destructive">Expiré</Badge>
    case "pending":
      return <Badge variant="secondary">En attente</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const isExpiringWithin30Days = (endDate: string) => {
  const today = new Date()
  const expiry = new Date(endDate)
  const timeDiff = expiry.getTime() - today.getTime()
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
  return daysDiff <= 30 && daysDiff > 0
}

export default function AutoInsurance() {
  const { clients } = useDataSync()
  const { insurances, loading, addInsurance } = useAutoInsurances()
  const [policies, setPolicies] = useState<AutoInsurancePolicy[]>([])
  
  useEffect(() => {
    const generatedPolicies = generateInsurancePoliciesFromClients(clients)
    setPolicies(generatedPolicies)
  }, [clients])
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { toast } = useToast()
  
  const [newPolicy, setNewPolicy] = useState({
    policy_number: "",
    client_name: "",
    vehicle_make: "",
    vehicle_model: "",
    year: "",
    license_plate: "",
    company: "GMC Assurances",
    insurance_type: "",
    start_date: "",
    end_date: "",
    premium: "",
    status: "active" as "active" | "expired" | "pending"
  })

  const generatePolicyNumber = () => {
    const existingNumbers = activePolicies
      .map(p => parseInt(p.policy_number.replace('AUTO', '')))
      .filter(n => !isNaN(n))
    const nextNumber = Math.max(...existingNumbers, 0) + 1
    return `AUTO${nextNumber.toString().padStart(3, '0')}`
  }

  const handleAddPolicy = async () => {
    if (!newPolicy.client_name || !newPolicy.vehicle_make || !newPolicy.vehicle_model || !newPolicy.premium) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      })
      return
    }

    try {
      const insuranceData = {
        numero_police: newPolicy.policy_number || generatePolicyNumber(),
        client_id: newPolicy.client_name, // Temporaire - devrait être l'ID du client
        marque_vehicule: newPolicy.vehicle_make,
        modele_vehicule: newPolicy.vehicle_model,
        annee_vehicule: parseInt(newPolicy.year) || new Date().getFullYear(),
        immatriculation: newPolicy.license_plate,
        date_debut: newPolicy.start_date,
        date_fin: newPolicy.end_date,
        prime_mensuelle: parseFloat(newPolicy.premium), // Utiliser prime_mensuelle au lieu de prime_annuelle
        statut: newPolicy.status === "active" ? "active" : newPolicy.status === "expired" ? "expiree" : "suspendue" as "active" | "expiree" | "suspendue" | "resiliee"
      }

      await addInsurance(insuranceData)
      
      setNewPolicy({
        policy_number: "",
        client_name: "",
        vehicle_make: "",
        vehicle_model: "",
        year: "",
        license_plate: "",
        company: "GMC Assurances",
        insurance_type: "",
        start_date: "",
        end_date: "",
        premium: "",
        status: "active"
      })
      setIsAddDialogOpen(false)
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  // Utilisation des données Supabase ou mockées temporairement  
  const activePolicies = insurances.length > 0 ? insurances.map(ins => ({
    id: parseInt(ins.id),
    policy_number: ins.numero_police || '',
    client_name: ins.client_id || '', // Devrait être le nom du client
    vehicle_make: ins.marque_vehicule || '',
    vehicle_model: ins.modele_vehicule || '',
    year: ins.annee_vehicule || new Date().getFullYear(),
    license_plate: ins.immatriculation || '',
    company: 'GMC Assurances', // Pas de colonne compagnie dans le schéma
    start_date: ins.date_debut || '',
    end_date: ins.date_fin || '',
    premium: ins.prime_mensuelle || 0, // Utiliser prime_mensuelle
    status: (ins.statut === "active" ? "active" : ins.statut === "expiree" ? "expired" : "pending") as "active" | "expired" | "pending"
  })) : policies.length > 0 ? policies : mockAutoInsurances.slice(0, 0)
  
  const filteredPolicies = activePolicies.filter(policy => {
    const matchesStatus = filterStatus === "all" || policy.status === filterStatus
    const matchesSearch = policy.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.policy_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.license_plate.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const expiringPolicies = activePolicies.filter(policy => 
    policy.status === "active" && isExpiringWithin30Days(policy.end_date)
  )

  const stats = {
    totalPolicies: activePolicies.length,
    activePolicies: activePolicies.filter(p => p.status === "active").length,
    totalPremiums: activePolicies.filter(p => p.status === "active").reduce((sum, p) => sum + p.premium, 0),
    expiringCount: expiringPolicies.length
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-primary">Assurances Automobiles</h1>
        <p className="text-muted-foreground">Gestion des contrats d'assurance automobile</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contrats</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPolicies}</div>
            <p className="text-xs text-muted-foreground">Tous contrats confondus</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contrats Actifs</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.activePolicies}</div>
            <p className="text-xs text-muted-foreground">En cours de validité</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Primes Totales</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPremiums.toLocaleString()} CFA</div>
            <p className="text-xs text-muted-foreground">Revenus annuels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.expiringCount}</div>
            <p className="text-xs text-muted-foreground">Expirent dans 30 jours</p>
          </CardContent>
        </Card>
      </div>

      {/* Expiring Policies Alert */}
      {expiringPolicies.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Contrats à renouveler bientôt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expiringPolicies.map(policy => (
                <div key={policy.id} className="flex justify-between items-center p-2 bg-background rounded">
                  <span>{policy.client_name} - {policy.vehicle_make} {policy.vehicle_model}</span>
                  <span className="text-sm text-muted-foreground">
                    Expire le {new Date(policy.end_date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Rechercher</Label>
            <Input
              id="search"
              placeholder="Client, contrat, immatriculation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="expired">Expiré</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Contrat d'Assurance Auto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Formulaire Contrat d'Assurance Automobile GMC</DialogTitle>
              <DialogDescription>
                Contrat complet d'assurance automobile avec toutes les informations requises.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Section Souscripteur */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">1. Informations du Souscripteur</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nom-complet">Nom complet *</Label>
                      <Input 
                        id="nom-complet" 
                        placeholder="Prénom et nom"
                        value={newPolicy.client_name}
                        onChange={(e) => setNewPolicy({ ...newPolicy, client_name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date-naissance">Date de naissance</Label>
                      <Input 
                        id="date-naissance" 
                        type="date"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lieu-naissance">Lieu de naissance</Label>
                      <Input 
                        id="lieu-naissance" 
                        placeholder="Ville de naissance"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nationalite">Nationalité</Label>
                      <Input 
                        id="nationalite" 
                        placeholder="Sénégalaise"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="profession">Profession</Label>
                      <Input 
                        id="profession" 
                        placeholder="Profession du souscripteur"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telephone">Téléphone</Label>
                      <Input 
                        id="telephone" 
                        placeholder="77 123 45 67"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email"
                        placeholder="email@exemple.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adresse">Adresse complète</Label>
                      <Input 
                        id="adresse" 
                        placeholder="Adresse du domicile"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type-piece">Type de pièce d'identité</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cni">Carte Nationale d'Identité</SelectItem>
                          <SelectItem value="passeport">Passeport</SelectItem>
                          <SelectItem value="permis">Permis de conduire</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numero-piece">Numéro de la pièce</Label>
                      <Input 
                        id="numero-piece" 
                        placeholder="Numéro de la pièce d'identité"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section Véhicule */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">2. Informations du Véhicule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="marque">Marque *</Label>
                      <Input 
                        id="marque" 
                        placeholder="Peugeot"
                        value={newPolicy.vehicle_make}
                        onChange={(e) => setNewPolicy({ ...newPolicy, vehicle_make: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="modele">Modèle *</Label>
                      <Input 
                        id="modele" 
                        placeholder="308"
                        value={newPolicy.vehicle_model}
                        onChange={(e) => setNewPolicy({ ...newPolicy, vehicle_model: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="immatriculation">Immatriculation *</Label>
                      <Input 
                        id="immatriculation" 
                        placeholder="AB-123-CD"
                        value={newPolicy.license_plate}
                        onChange={(e) => setNewPolicy({ ...newPolicy, license_plate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="annee">Année de mise en circulation</Label>
                      <Input 
                        id="annee" 
                        type="number"
                        placeholder="2020"
                        value={newPolicy.year}
                        onChange={(e) => setNewPolicy({ ...newPolicy, year: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="chassis">Numéro de châssis</Label>
                      <Input 
                        id="chassis" 
                        placeholder="VF3XXXXXXXXXXXXXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cylindree">Cylindrée</Label>
                      <Input 
                        id="cylindree" 
                        placeholder="1600 cm³"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type-vehicule">Type de véhicule</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="berline">Berline</SelectItem>
                          <SelectItem value="break">Break</SelectItem>
                          <SelectItem value="suv">SUV</SelectItem>
                          <SelectItem value="utilitaire">Utilitaire</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valeur">Valeur estimée (CFA)</Label>
                      <Input 
                        id="valeur" 
                        type="number"
                        placeholder="15000000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="usage">Usage</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prive">Privé</SelectItem>
                          <SelectItem value="professionnel">Professionnel</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section Garantie et Durée */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">3. Garantie</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="garantie">Type de garantie *</Label>
                      <Select value={newPolicy.insurance_type} onValueChange={(value) => setNewPolicy({ ...newPolicy, insurance_type: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="RC Simple">RC Simple</SelectItem>
                          <SelectItem value="RC + Vol">RC + Vol</SelectItem>
                          <SelectItem value="RC + Vol + Incendie">RC + Vol + Incendie</SelectItem>
                          <SelectItem value="Tous Risques">Tous Risques</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">4. Durée du Contrat</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="date-debut">Date de début</Label>
                      <Input 
                        id="date-debut" 
                        type="date"
                        value={newPolicy.start_date}
                        onChange={(e) => setNewPolicy({ ...newPolicy, start_date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duree-contrat">Durée du contrat</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="1 an par défaut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6-mois">6 mois</SelectItem>
                          <SelectItem value="1-an">1 an</SelectItem>
                          <SelectItem value="2-ans">2 ans</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date-echeance">Date d'échéance</Label>
                      <Input 
                        id="date-echeance" 
                        type="date"
                        value={newPolicy.end_date}
                        onChange={(e) => setNewPolicy({ ...newPolicy, end_date: e.target.value })}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Section Paiement */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">5. Modalités de Paiement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prime">Prime annuelle (CFA) *</Label>
                      <Input 
                        id="prime" 
                        type="number"
                        placeholder="850000"
                        value={newPolicy.premium}
                        onChange={(e) => setNewPolicy({ ...newPolicy, premium: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mode-paiement">Mode de paiement</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="especes">Espèces</SelectItem>
                          <SelectItem value="cheque">Chèque</SelectItem>
                          <SelectItem value="virement">Virement bancaire</SelectItem>
                          <SelectItem value="mobile">Mobile Money</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date-paiement">Date de paiement</Label>
                      <Input 
                        id="date-paiement" 
                        type="date"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numero-recu">Numéro de reçu</Label>
                      <Input 
                        id="numero-recu" 
                        placeholder="Généré automatiquement"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section Pièces jointes et Observations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">6. Pièces Jointes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>☐ Copie CNI du souscripteur</div>
                      <div>☐ Permis de conduire</div>
                      <div>☐ Carte grise du véhicule</div>
                      <div>☐ Rapport d'expertise (si nécessaire)</div>
                      <div>☐ Photos du véhicule</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">7. Observations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="observations">Observations particulières</Label>
                      <textarea 
                        id="observations"
                        className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-sm"
                        placeholder="Observations ou remarques particulières..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Section Signatures */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">8. Signatures</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lieu-signature">Lieu</Label>
                      <Input 
                        id="lieu-signature" 
                        placeholder="Dakar"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date-signature">Date</Label>
                      <Input 
                        id="date-signature" 
                        type="date"
                        defaultValue={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    <div className="text-center space-y-4">
                      <p className="font-medium">Signature du Souscripteur</p>
                      <div className="border-2 border-dashed border-muted-foreground h-20 flex items-center justify-center text-muted-foreground">
                        Signature
                      </div>
                    </div>
                    <div className="text-center space-y-4">
                      <p className="font-medium">Cachet et Signature GMC Assurance</p>
                      <div className="border-2 border-dashed border-muted-foreground h-20 flex items-center justify-center text-muted-foreground">
                        Cachet + Signature
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-end gap-2 pt-6 border-t">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="button" variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Imprimer
              </Button>
              <Button onClick={handleAddPolicy}>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer le Contrat
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Policies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Contrats d'Assurance Automobile</CardTitle>
          <CardDescription>
            {filteredPolicies.length} contrat(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Contrat</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Véhicule</TableHead>
                  <TableHead>Immatriculation</TableHead>
                  <TableHead>Échéance</TableHead>
                  <TableHead>Prime</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPolicies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell className="font-medium">{policy.policy_number}</TableCell>
                    <TableCell>{policy.client_name}</TableCell>
                    <TableCell>{policy.vehicle_make} {policy.vehicle_model} ({policy.year})</TableCell>
                    <TableCell>{policy.license_plate}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {new Date(policy.end_date).toLocaleDateString()}
                        {isExpiringWithin30Days(policy.end_date) && policy.status === "active" && (
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{policy.premium.toLocaleString()} CFA</TableCell>
                    <TableCell>{getStatusBadge(policy.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}