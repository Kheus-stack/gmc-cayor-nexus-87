import { useState } from "react"
import { CreditCard, Plus, Calendar, Upload, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { useToast } from "@/hooks/use-toast"
import { usePayments } from "@/hooks/usePayments"

interface Payment {
  id: number
  nom_client: string
  contrat_concerne: string
  type_paiement: string
  montant_paye: number
  mode_paiement: string
  date_paiement: string
  reference_recu: string
  observations: string
  justificatif: string
}

export default function Payments() {
  const { toast } = useToast()
  const { payments, loading, addPayment } = usePayments()

  const [isAddingPayment, setIsAddingPayment] = useState(false)
  
  const form = useForm({
    defaultValues: {
      nom_client: "",
      contrat_concerne: "",
      type_paiement: "Loyer",
      montant_paye: "",
      mode_paiement: "Virement",
      date_paiement: "",
      reference_recu: "",
      observations: "",
      justificatif: ""
    }
  })

  const onSubmit = async (data: any) => {
    try {
      const paymentData = {
        client_id: data.nom_client, // Temporaire - devrait être l'ID du client
        contrat_id: data.contrat_concerne, // Temporaire - devrait être l'ID du contrat
        type_paiement: data.type_paiement as "loyer" | "caution" | "entretien" | "assurance" | "autre",
        montant: parseInt(data.montant_paye),
        mode_paiement: data.mode_paiement as "especes" | "virement" | "mobile_money",
        date_paiement: data.date_paiement,
        reference_recu: data.reference_recu,
        observations: data.observations,
        justificatif_url: data.justificatif
      }
      
      await addPayment(paymentData)
      form.reset()
      setIsAddingPayment(false)
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "Loyer":
        return <Badge className="bg-primary/20 text-primary border-primary/30">Loyer</Badge>
      case "Caution":
        return <Badge variant="secondary">Caution</Badge>
      case "Entretien":
        return <Badge variant="outline">Entretien</Badge>
      case "Assurance":
        return <Badge className="bg-warning/20 text-warning border-warning/30">Assurance</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-primary">Gestion des Paiements</h1>
        <p className="text-muted-foreground">Suivi des loyers et paiements</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Rechercher</Label>
            <Input
              id="search"
              placeholder="Propriété, mois..."
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
                <SelectItem value="paye">Payé</SelectItem>
                <SelectItem value="attente">En attente</SelectItem>
                <SelectItem value="retard">En retard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Dialog open={isAddingPayment} onOpenChange={setIsAddingPayment}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Paiement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>💳 Formulaire de Paiement</DialogTitle>
              <DialogDescription>
                Enregistrer un nouveau paiement (loyer, assurance, service)
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Section Client */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">👤 Locataire / Client</h3>
                  
                  <FormField
                    control={form.control}
                    name="nom_client"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du client</FormLabel>
                        <FormControl>
                          <Input placeholder="Amadou Diallo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contrat_concerne"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contrat concerné</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un contrat" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CONT001 - Appartement Plateau">CONT001 - Appartement Plateau</SelectItem>
                            <SelectItem value="CONT002 - Villa Fann">CONT002 - Villa Fann</SelectItem>
                            <SelectItem value="CONT003 - Bureau Centre">CONT003 - Bureau Centre</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type_paiement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de paiement</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Loyer">Loyer</SelectItem>
                            <SelectItem value="Caution">Caution</SelectItem>
                            <SelectItem value="Entretien">Entretien</SelectItem>
                            <SelectItem value="Assurance">Assurance</SelectItem>
                            <SelectItem value="Autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section Détails du paiement */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">💳 Détails du paiement</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="montant_paye"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Montant payé (FCFA)</FormLabel>
                          <FormControl>
                            <Input placeholder="450000" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mode_paiement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mode de paiement</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Mode" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Espèces">Espèces</SelectItem>
                              <SelectItem value="Virement">Virement</SelectItem>
                              <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date_paiement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de paiement</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="reference_recu"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Référence / Reçu</FormLabel>
                          <FormControl>
                            <Input placeholder="REC001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="observations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observations</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Observations sur ce paiement" rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section Pièce jointe */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">📎 Pièce jointe</h3>
                  
                  <FormField
                    control={form.control}
                    name="justificatif"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Justificatif de paiement (optionnel)</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom du fichier ou URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddingPayment(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">Enregistrer le paiement</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des Paiements</CardTitle>
          <CardDescription>
            {payments.length} paiement(s) enregistré(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-4">Chargement des paiements...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Contrat</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Référence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.client_id}</TableCell>
                      <TableCell>{payment.contrat_id}</TableCell>
                      <TableCell>{getTypeBadge(payment.type_paiement)}</TableCell>
                      <TableCell>{payment.montant?.toLocaleString()} CFA</TableCell>
                      <TableCell>{payment.mode_paiement}</TableCell>
                      <TableCell>{payment.date_paiement ? new Date(payment.date_paiement).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>{payment.reference_recu}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}