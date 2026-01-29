import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import SectionTitle from "./SectionTitle";
import SimulatorInput from "./SimulatorInput";
import SimulatorDateInput from "./SimulatorDateInput";
import SimulatorSelect from "./SimulatorSelect";
import AllocationTable from "./AllocationTable";
import FraisTable from "./FraisTable";

const LifeInsuranceSimulator = () => {
  const [isExpertMode, setIsExpertMode] = useState(true);

  // Données de la simulation
  const [dureeSimulation, setDureeSimulation] = useState("15");
  const [regimeImposition, setRegimeImposition] = useState("pfu");
  const [dateOuverture, setDateOuverture] = useState("01/01/2020");

  // Situation du contrat
  const [dateDerniereSituation, setDateDerniereSituation] = useState("01/01/2021");
  const [totalPrimesVersees, setTotalPrimesVersees] = useState("1 000 000");
  const [totalMontantsRachetes, setTotalMontantsRachetes] = useState("100 000");
  const [valeurRachat, setValeurRachat] = useState("1 050 000");

  // Allocation
  const [allocationFondsEuros, setAllocationFondsEuros] = useState("70");
  const [allocationUcHorsImmobilier, setAllocationUcHorsImmobilier] = useState("20");
  const [allocationUcImmobilier, setAllocationUcImmobilier] = useState("10");

  // Taux de capitalisation annuel
  const [tauxFondsEuros, setTauxFondsEuros] = useState("5");
  const [tauxUcHorsImmobilier, setTauxUcHorsImmobilier] = useState("6");
  const [tauxUcImmobilier, setTauxUcImmobilier] = useState("7");

  // Frais de gestion
  const [fraisGestionFondsEuros, setFraisGestionFondsEuros] = useState("0");
  const [fraisGestionUc, setFraisGestionUc] = useState("0");

  // Frais de souscription
  const [fraisSouscriptionFondsEuros, setFraisSouscriptionFondsEuros] = useState("0");
  const [fraisSouscriptionUc, setFraisSouscriptionUc] = useState("0");

  const handleReset = () => {
    setDureeSimulation("15");
    setRegimeImposition("pfu");
    setDateOuverture("01/01/2020");
    setDateDerniereSituation("01/01/2021");
    setTotalPrimesVersees("1 000 000");
    setTotalMontantsRachetes("100 000");
    setValeurRachat("1 050 000");
    setAllocationFondsEuros("70");
    setAllocationUcHorsImmobilier("20");
    setAllocationUcImmobilier("10");
    setTauxFondsEuros("5");
    setTauxUcHorsImmobilier("6");
    setTauxUcImmobilier("7");
    setFraisGestionFondsEuros("0");
    setFraisGestionUc("0");
    setFraisSouscriptionFondsEuros("0");
    setFraisSouscriptionUc("0");
  };

  const handleCalculate = () => {
    // Logique de calcul à implémenter
    console.log("Calcul lancé avec les paramètres:", {
      dureeSimulation,
      regimeImposition,
      dateOuverture,
      dateDerniereSituation,
      totalPrimesVersees,
      totalMontantsRachetes,
      valeurRachat,
      allocation: {
        fondsEuros: allocationFondsEuros,
        ucHorsImmobilier: allocationUcHorsImmobilier,
        ucImmobilier: allocationUcImmobilier,
      },
      taux: {
        fondsEuros: tauxFondsEuros,
        ucHorsImmobilier: tauxUcHorsImmobilier,
        ucImmobilier: tauxUcImmobilier,
      },
      ...(isExpertMode && {
        fraisGestion: {
          fondsEuros: fraisGestionFondsEuros,
          uc: fraisGestionUc,
        },
        fraisSouscription: {
          fondsEuros: fraisSouscriptionFondsEuros,
          uc: fraisSouscriptionUc,
        },
      }),
    });
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border max-w-lg mx-auto">
      {/* Header avec switch */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          Simulateur d'assurance vie
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {isExpertMode ? "Expert" : "Simplifié"}
          </span>
          <Switch
            checked={isExpertMode}
            onCheckedChange={setIsExpertMode}
          />
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Données de la simulation */}
        <section>
          <SectionTitle>Données de la simulation</SectionTitle>
          <div className="space-y-1">
            <SimulatorInput
              label="Durée de la simulation"
              value={dureeSimulation}
              onChange={setDureeSimulation}
              unit="ans"
            />
            <SimulatorSelect
              label="Régime d'imposition"
              value={regimeImposition}
              onChange={setRegimeImposition}
              options={[
                { value: "pfu", label: "PFU" },
                { value: "bareme", label: "Barème" },
              ]}
            />
            <SimulatorDateInput
              label="Date d'ouverture du contrat"
              value={dateOuverture}
              onChange={setDateOuverture}
            />
          </div>
        </section>

        {/* Situation du contrat */}
        <section>
          <SectionTitle>Situation du contrat au 01/01/2021</SectionTitle>
          <div className="space-y-1">
            <SimulatorDateInput
              label="Date de dernière situation"
              value={dateDerniereSituation}
              onChange={setDateDerniereSituation}
            />
            <SimulatorInput
              label="Total des primes versées"
              value={totalPrimesVersees}
              onChange={setTotalPrimesVersees}
              unit="€"
              required
              info
            />
            <SimulatorInput
              label="Total des montants rachetés"
              value={totalMontantsRachetes}
              onChange={setTotalMontantsRachetes}
              unit="€"
              info
            />
            <SimulatorInput
              label="Valeur de rachat"
              value={valeurRachat}
              onChange={setValeurRachat}
              unit="€"
            />
          </div>

          <div className="mt-4">
            <AllocationTable
              fondsEuros={allocationFondsEuros}
              ucHorsImmobilier={allocationUcHorsImmobilier}
              ucImmobilier={allocationUcImmobilier}
              onFondsEurosChange={setAllocationFondsEuros}
              onUcHorsImmobilierChange={setAllocationUcHorsImmobilier}
              onUcImmobilierChange={setAllocationUcImmobilier}
            />
          </div>
        </section>

        {/* Taux de capitalisation annuel */}
        <section>
          <SectionTitle>Taux de capitalisation annuel</SectionTitle>
          <AllocationTable
            fondsEuros={tauxFondsEuros}
            ucHorsImmobilier={tauxUcHorsImmobilier}
            ucImmobilier={tauxUcImmobilier}
            onFondsEurosChange={setTauxFondsEuros}
            onUcHorsImmobilierChange={setTauxUcHorsImmobilier}
            onUcImmobilierChange={setTauxUcImmobilier}
          />
        </section>

        {/* Frais de gestion - Expert mode only */}
        {isExpertMode && (
          <section>
            <SectionTitle>Frais de gestion</SectionTitle>
            <FraisTable
              fondsEuros={fraisGestionFondsEuros}
              uc={fraisGestionUc}
              onFondsEurosChange={setFraisGestionFondsEuros}
              onUcChange={setFraisGestionUc}
            />
          </section>
        )}

        {/* Frais de souscription - Expert mode only */}
        {isExpertMode && (
          <section>
            <SectionTitle>Frais de souscription</SectionTitle>
            <FraisTable
              fondsEuros={fraisSouscriptionFondsEuros}
              uc={fraisSouscriptionUc}
              onFondsEurosChange={setFraisSouscriptionFondsEuros}
              onUcChange={setFraisSouscriptionUc}
            />
          </section>
        )}

        {/* Actions */}
        <div className="flex items-center justify-center gap-8 pt-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={handleReset}
            className="text-muted-foreground hover:text-foreground"
          >
            Annuler
          </Button>
          <Button
            variant="ghost"
            onClick={handleCalculate}
            className="text-primary hover:text-primary/80 flex items-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            Calculer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LifeInsuranceSimulator;
