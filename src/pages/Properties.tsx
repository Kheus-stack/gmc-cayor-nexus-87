import { Building2, Plus, Search, Filter, Upload, ImageIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useProperties } from "@/hooks/useProperties"

export default function Properties() {
  const { properties, loading, addProperty } = useProperties()
  const [isOpen, setIsOpen] = useState(false)
  
  const form = useForm({
    defaultValues: {
      type_bien: "appartement",
      titre_bien: "",
      adresse: "",
      ville_zone: "",
      superficie: "",
      nombre_pieces: "",
      etage: "",
    usage: "habitation",
    statut: "disponible",
    lien_photos: "",
      description: "",
      prix_loyer: "",
      charges_mensuelles: ""
    }
  })

  const onSubmit = async (data: any) => {
    try {
      await addProperty(data)
      form.reset()
      setIsOpen(false)
    } catch (error) {
      console.error('Error adding property:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "loue":
        return <Badge className="bg-success/20 text-success border-success/30">Loué</Badge>
      case "disponible":
        return <Badge variant="secondary">Disponible</Badge>
      case "en_vente":
        return <Badge variant="outline">En vente</Badge>
      case "occupe":
        return <Badge className="bg-warning/20 text-warning border-warning/30">Occupé</Badge>
      case "hors_service":
        return <Badge variant="destructive">Hors service</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-primary">Gestion des Propriétés</h1>
        <p className="text-muted-foreground">Gestion de votre portefeuille immobilier</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Rechercher</Label>
            <Input
              id="search"
              placeholder="Adresse, type, ID..."
              className="w-full sm:w-64"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="loue">Loué</SelectItem>
                <SelectItem value="disponible">Disponible</SelectItem>
                <SelectItem value="en_vente">En vente</SelectItem>
                <SelectItem value="occupe">Occupé</SelectItem>
                <SelectItem value="hors_service">Hors service</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Propriété
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>🏠 Formulaire de Propriété Immobilière</DialogTitle>
              <DialogDescription>
                Créer ou modifier une fiche de bien immobilier
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Section Détails du bien */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">🏘️ Détails du bien</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="type_bien"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type de bien</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="appartement">Appartement</SelectItem>
                              <SelectItem value="maison">Maison</SelectItem>
                              <SelectItem value="terrain">Terrain</SelectItem>
                              <SelectItem value="bureau">Bureau</SelectItem>
                              <SelectItem value="autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="titre_bien"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Titre du bien</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Appartement moderne Dakar" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="adresse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse</FormLabel>
                        <FormControl>
                          <Input placeholder="Adresse complète du bien" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="ville_zone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ville / Zone</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Dakar, Plateau" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="superficie"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Superficie (m²)</FormLabel>
                          <FormControl>
                            <Input placeholder="75" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="nombre_pieces"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de pièces</FormLabel>
                          <FormControl>
                            <Input placeholder="3" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="etage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Étage</FormLabel>
                          <FormControl>
                            <Input placeholder="2ème étage" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="usage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Usage</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Usage" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="habitation">Habitation</SelectItem>
                              <SelectItem value="commercial">Commercial</SelectItem>
                              <SelectItem value="mixte">Mixte</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="statut"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Statut</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner le statut" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="disponible">Disponible</SelectItem>
                            <SelectItem value="loue">Loué</SelectItem>
                            <SelectItem value="en_vente">En vente</SelectItem>
                            <SelectItem value="occupe">Occupé</SelectItem>
                            <SelectItem value="hors_service">Hors service</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section Médias */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">📸 Médias</h3>
                  
                  <FormField
                    control={form.control}
                    name="lien_photos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lien photos / dossier Drive</FormLabel>
                        <FormControl>
                          <Input placeholder="https://drive.google.com/..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Description détaillée du bien" rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section Données financières */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">💰 Données financières</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="prix_loyer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prix / Loyer mensuel (FCFA)</FormLabel>
                          <FormControl>
                            <Input placeholder="450000" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="charges_mensuelles"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Charges mensuelles (FCFA)</FormLabel>
                          <FormControl>
                            <Input placeholder="25000" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">Ajouter la propriété</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Propriétés</CardTitle>
          <CardDescription>
            {properties.length} propriété(s) dans votre portefeuille
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Bien</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Ville</TableHead>
                  <TableHead>Superficie</TableHead>
                  <TableHead>Loyer</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">{property.id || property.id_bien || `PROP${property.id?.slice(-3)}`}</TableCell>
                    <TableCell>{property.titre || property.titre_bien}</TableCell>
                    <TableCell>{property.type_bien}</TableCell>
                    <TableCell>{property.ville || property.ville_zone}</TableCell>
                    <TableCell>{property.superficie} m²</TableCell>
                    <TableCell>{(property.prix_loyer_mensuel || property.prix_loyer || 0).toLocaleString()} CFA</TableCell>
                    <TableCell>{getStatusBadge(property.statut || 'disponible')}</TableCell>
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