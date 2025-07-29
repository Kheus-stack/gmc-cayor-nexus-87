import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Plus, Search, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CarRentalForm } from "@/components/forms/CarRentalForm"
import { useToast } from "@/hooks/use-toast"

export function CarRentals() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { toast } = useToast()
  const rentals = [
    {
      id: "CAR001",
      clientName: "Amadou Diallo",
      vehicle: "Toyota Corolla",
      pickupDate: "2024-02-15",
      returnDate: "2024-02-18",
      location: "Aéroport LSS",
      dailyRate: 25000,
      totalDays: 3,
      status: "active"
    },
    {
      id: "CAR002",
      clientName: "Fatou Sow",
      vehicle: "Nissan Sentra",
      pickupDate: "2024-02-20",
      returnDate: "2024-02-25",
      location: "Centre-ville",
      dailyRate: 20000,
      totalDays: 5,
      status: "reserved"
    }
  ]

  const handleNewRental = async (data: any) => {
    try {
      // Ici vous pourrez intégrer avec votre base de données
      console.log('Nouvelle location:', data)
      
      toast({
        title: "Location créée",
        description: "La nouvelle location de véhicule a été créée avec succès"
      })
      
      return { success: true, message: "Location créée avec succès" }
    } catch (error) {
      return { success: false, message: "Erreur lors de la création de la location" }
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      reserved: "secondary",
      completed: "outline",
      cancelled: "destructive"
    } as const
    
    const labels = {
      active: "En cours",
      reserved: "Réservé",
      completed: "Terminé",
      cancelled: "Annulé"
    }
    
    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Car className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Location de Véhicules</h1>
          <p className="text-muted-foreground">
            Gestion du parc automobile et locations
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Véhicules Disponibles</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Sur 18 total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locations Actives</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">En cours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus du Mois</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.8M</div>
            <p className="text-xs text-muted-foreground">FCFA</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'Utilisation</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67%</div>
            <p className="text-xs text-muted-foreground">Du parc</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Locations en Cours</CardTitle>
              <CardDescription>Suivi des locations de véhicules</CardDescription>
            </div>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Location
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Rechercher une location..."
              className="flex-1"
            />
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Véhicule</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Lieu</TableHead>
                <TableHead>Tarif/Jour</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentals.map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell className="font-medium">{rental.id}</TableCell>
                  <TableCell>{rental.clientName}</TableCell>
                  <TableCell>{rental.vehicle}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Du: {new Date(rental.pickupDate).toLocaleDateString()}</div>
                      <div>Au: {new Date(rental.returnDate).toLocaleDateString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>{rental.location}</TableCell>
                  <TableCell>{rental.dailyRate.toLocaleString()} FCFA</TableCell>
                  <TableCell className="font-semibold">
                    {(rental.dailyRate * rental.totalDays).toLocaleString()} FCFA
                  </TableCell>
                  <TableCell>{getStatusBadge(rental.status)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CarRentalForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleNewRental}
      />
    </div>
  )
}