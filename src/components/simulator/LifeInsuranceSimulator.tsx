import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import SectionTitle from "./SectionTitle";
import SimulatorInput from "./SimulatorInput";
import SimulatorDateInput from "./SimulatorDateInput";
import SimulatorSelect from "./SimulatorSelect";
import AllocationTable from "./AllocationTable";
import FraisContratModal from "./FraisContratModal";
import EpargneConstitueeModal from "./EpargneConstitueeModal";
import ResultsPanel from "./ResultsPanel";

const LifeInsuranceSimulator = () => {
  const [isExpertMode, setIsExpertMode] = useState(true);
  const [showResults, setShowResults] = useState(false);

  // Données de la simulation
  const [dureeSimulation, setDureeSimulation] = useState("15");
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

  // Mode simplifié - Revenus, TMI et épargne constituée
  const [revenuImposable, setRevenuImposable] = useState("60 000");
  const [nombreParts, setNombreParts] = useState("2");
  const [tmi, setTmi] = useState("30");
  const [versementsAvant, setVersementsAvant] = useState("50 000");
  const [versementsApres, setVersementsApres] = useState("50 000");
  const [interetsAvant, setInteretsAvant] = useState("25 000");
  const [interetsApres, setInteretsApres] = useState("25 000");
  const [fraisSouscriptionUc, setFraisSouscriptionUc] = useState("0");
  const [abattementDisponible, setAbattementDisponible] = useState("9 200");

  // Rachat
  const [montantRachete, setMontantRachete] = useState("0");

  // Calcul du total épargne constituée
  const parseNumber = (value: string) => {
    return parseFloat(value.replace(/\s/g, "").replace(",", ".")) || 0;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString("fr-FR");
  };

  // Vérifier si la date d'ouverture est avant le 27 sept 2017
  const isContractBeforeSept2017 = () => {
    const parts = dateOuverture.split("/");
    if (parts.length !== 3) return false;
    const date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    const sept2017 = new Date(2017, 8, 27); // 27 septembre 2017
    return date < sept2017;
  };

  // Vérifier si le contrat a plus de 8 ans
  const isContractOver8Years = () => {
    const parts = dateOuverture.split("/");
    if (parts.length !== 3) return false;
    const date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    const today = new Date();
    const diffYears = (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return diffYears >= 8;
  };

  // Valeurs effectives des versements/intérêts avant sept 17 (0 si contrat après cette date)
  const effectiveVersementsAvant = isContractBeforeSept2017() ? parseNumber(versementsAvant) : 0;
  const effectiveInteretsAvant = isContractBeforeSept2017() ? parseNumber(interetsAvant) : 0;

  const totalEpargne = formatNumber(
    effectiveVersementsAvant +
    parseNumber(versementsApres) +
    effectiveInteretsAvant +
    parseNumber(interetsApres)
  );

  const handleRachatTotal = () => {
    setMontantRachete(totalEpargne);
  };

  const handleReset = () => {
    setDureeSimulation("15");
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
    setRevenuImposable("60 000");
    setNombreParts("2");
    setTmi("30");
    setVersementsAvant("50 000");
    setVersementsApres("50 000");
    setInteretsAvant("25 000");
    setInteretsApres("25 000");
    setMontantRachete("0");
    setAbattementDisponible("9 200");
    setShowResults(false);
  };

  const handleCalculate = () => {
    setShowResults(true);
    console.log("Calcul lancé avec les paramètres:", {
      dureeSimulation,
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
    <div className="flex gap-4 max-w-4xl mx-auto">
      <div className={`bg-card rounded-lg shadow-sm border border-border transition-all duration-300 ${showResults && !isExpertMode ? 'w-1/2' : 'max-w-lg mx-auto w-full'}`}>
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
              onCheckedChange={(checked) => {
                setIsExpertMode(checked);
                setShowResults(false);
              }}
            />
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Données de la simulation - Mode Expert */}
          {isExpertMode && (
            <section>
              <SectionTitle>Données de la simulation</SectionTitle>
              <div className="space-y-1">
                <SimulatorInput
                  label="Durée de la simulation"
                  value={dureeSimulation}
                  onChange={setDureeSimulation}
                  unit="ans"
                  formatThousands={false}
                />
                <SimulatorDateInput
                  label="Date d'ouverture du contrat"
                  value={dateOuverture}
                  onChange={setDateOuverture}
                />
              </div>
            </section>
          )}

          {/* Données de la mission - Mode Simplifié */}
          {!isExpertMode && (
            <section>
              <SectionTitle>Données du contrat</SectionTitle>
              <div className="space-y-1">
                <SimulatorDateInput
                  label="Date d'ouverture du contrat"
                  value={dateOuverture}
                  onChange={setDateOuverture}
                />
                <EpargneConstitueeModal
                  versementsAvant={versementsAvant}
                  versementsApres={versementsApres}
                  interetsAvant={interetsAvant}
                  interetsApres={interetsApres}
                  onVersementsAvantChange={setVersementsAvant}
                  onVersementsApresChange={setVersementsApres}
                  onInteretsAvantChange={setInteretsAvant}
                  onInteretsApresChange={setInteretsApres}
                  totalEpargne={totalEpargne}
                  showAvantSept17={isContractBeforeSept2017()}
                />
              </div>
            </section>
          )}

          {/* Situation du contrat - Expert mode */}
          {isExpertMode && (
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
          )}

          {/* Mode simplifié - Situation fiscale */}
          {!isExpertMode && (
            <>
              <section>
                <SectionTitle>Situation fiscale</SectionTitle>
                <div className="space-y-1">
                <SimulatorInput
                    label="Revenu imposable"
                    value={revenuImposable}
                    onChange={setRevenuImposable}
                    unit="€"
                    infoText="Revenu net imposable du foyer fiscal (avant application du barème). Utilisé pour le calcul de la CEHR."
                  />
                  <SimulatorInput
                    label="Nombre de part(s) fiscale(s)"
                    value={nombreParts}
                    onChange={setNombreParts}
                    formatThousands={false}
                    infoText="Nombre de parts du quotient familial. Détermine les seuils de la CEHR : 250 000 € / 500 000 € pour 1 part, 500 000 € / 1 000 000 € pour 2 parts ou plus."
                  />
                  <SimulatorSelect
                    label="TMI"
                    value={tmi}
                    onChange={setTmi}
                    options={[
                      { value: "0", label: "0%" },
                      { value: "11", label: "11%" },
                      { value: "30", label: "30%" },
                      { value: "41", label: "41%" },
                      { value: "45", label: "45%" },
                    ]}
                    infoText="Tranche Marginale d'Imposition. Utilisée pour calculer l'IR au barème progressif et le gain lié à la CSG déductible (6,8% × intérêts taxables × TMI)."
                  />
                  <SimulatorInput
                    label="Abattement disponible"
                    value={abattementDisponible}
                    onChange={(val) => {
                      const num = parseNumber(val);
                      if (num <= 9200) {
                        setAbattementDisponible(val);
                      } else {
                        setAbattementDisponible("9 200");
                      }
                    }}
                    unit="€"
                    disabled={!isContractOver8Years()}
                    infoText="Abattement annuel sur les intérêts pour les contrats de plus de 8 ans (max 4 600 € pour une personne seule, 9 200 € pour un couple). S'impute en priorité sur les intérêts av. sept 17, puis ap. sept 17 à 7,5%, puis à 12,8%."
                  />
                </div>
              </section>

              <section>
                <SectionTitle>Rachat</SectionTitle>
                <div className="flex items-center justify-between py-2">
                  <label className="text-sm text-muted-foreground">Montant racheté</label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={parseNumber(montantRachete).toLocaleString("fr-FR")}
                        onChange={(e) => setMontantRachete(e.target.value.replace(/\s/g, ""))}
                        className="simulator-input w-28 text-right h-8 px-2 flex rounded-md border border-input bg-background text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
                      />
                      <span className="text-sm text-muted-foreground min-w-8">€</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRachatTotal}
                      className="text-xs h-8"
                    >
                      Rachat total
                    </Button>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Taux de capitalisation annuel - Expert mode only */}
          {isExpertMode && (
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
          )}

          {/* Frais du contrat - Expert mode only */}
          {isExpertMode && (
            <section>
              <FraisContratModal
                fraisGestionFondsEuros={fraisGestionFondsEuros}
                fraisGestionUc={fraisGestionUc}
                fraisSouscriptionFondsEuros={fraisSouscriptionFondsEuros}
                fraisSouscriptionUc={fraisSouscriptionUc}
                onFraisGestionFondsEurosChange={setFraisGestionFondsEuros}
                onFraisGestionUcChange={setFraisGestionUc}
                onFraisSouscriptionFondsEurosChange={setFraisSouscriptionFondsEuros}
                onFraisSouscriptionUcChange={setFraisSouscriptionUc}
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

      {/* Panneau des résultats - Mode Simplifié uniquement */}
      {!isExpertMode && showResults && (
        <div className="w-1/2 animate-in slide-in-from-right duration-300">
          <ResultsPanel
            isOpen={showResults}
            onClose={() => setShowResults(false)}
            montantRachete={montantRachete}
            versementsAvant={isContractBeforeSept2017() ? versementsAvant : "0"}
            versementsApres={versementsApres}
            interetsAvant={isContractBeforeSept2017() ? interetsAvant : "0"}
            interetsApres={interetsApres}
            abattementDisponible={abattementDisponible}
            isContractOver8Years={isContractOver8Years()}
            tmi={tmi}
            revenuImposable={revenuImposable}
            nombreParts={nombreParts}
          />
        </div>
      )}
    </div>
  );
};

export default LifeInsuranceSimulator;
