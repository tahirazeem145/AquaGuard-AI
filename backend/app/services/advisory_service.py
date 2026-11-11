from typing import List
from backend.app.models.schemas import PrescriptiveActionItem, WaterQualityResponse

class PrescriptiveAdvisoryService:
    """
    Translates diagnostic pathology and environmental anomalies into concrete,
    prioritized, non-antibiotic mitigation protocols for aquaculture farmers.
    """

    @staticmethod
    def generate_action_plan(
        condition: str,
        water_health: WaterQualityResponse,
        severity_tier: str
    ) -> List[PrescriptiveActionItem]:
        plan: List[PrescriptiveActionItem] = []
        priority = 1

        # 1. Immediate Critical Biosecurity / Emergency Overrides
        if water_health.biological_guardrail_triggered or severity_tier == "EMERGENCY":
            plan.append(PrescriptiveActionItem(
                priority=priority,
                category="Emergency Life Support",
                title="Immediate Aeration & Feeding Halt",
                instruction=(
                    "Turn on all supplemental paddlewheel and aspirator aerators immediately. "
                    "Completely halt feeding for 24 hours to prevent biological oxygen demand (BOD) collapse "
                    "and avoid metabolic ammonia shedding."
                ),
                dosage_or_metric="Continuous aeration until DO > 5.0 mg/L"
            ))
            priority += 1

        # 2. Water Quality Remediation based on Specific Anomalies
        ammonia_val = water_health.un_ionized_ammonia_mg_l
        if ammonia_val > 0.03:
            plan.append(PrescriptiveActionItem(
                priority=priority,
                category="Water Remediation",
                title="Bottom-Sludge Water Exchange & Zeolite Application",
                instruction=(
                    "Conduct a 25% to 30% bottom-water exchange to flush out decomposing organic sludge. "
                    "Apply agricultural zeolite or activated carbon to bind toxic free ammonia."
                ),
                dosage_or_metric="50 - 100 kg/hectare agricultural zeolite"
            ))
            priority += 1

        ph_status = water_health.parameter_compliance.get("ph")
        if ph_status and ph_status.status == "CAUTION" and ph_status.value < 6.8:
            plan.append(PrescriptiveActionItem(
                priority=priority,
                category="Alkalinity Buffer",
                title="Agricultural Limestone (CaCO3) Application",
                instruction=(
                    "Apply finely ground agricultural limestone to buffer pond water pH, elevate total alkalinity "
                    "above 80 mg/L, and halt fungal oomycete spore attachment."
                ),
                dosage_or_metric="200 - 300 kg/hectare agricultural lime"
            ))
            priority += 1

        # 3. Pathogen-Specific Non-Antibiotic Treatments
        c_lower = condition.lower()
        if "ichthyophthiriasis" in c_lower or "parasitic" in c_lower or "white spot" in c_lower:
            plan.append(PrescriptiveActionItem(
                priority=priority,
                category="Therapeutic Saline Bath",
                title="Sodium Chloride (NaCl) Osmotic Disruption",
                instruction=(
                    "Prepare a non-iodized salt bath for sampled moribund fish during net inspections. "
                    "Salt disrupts the osmotic gradient of free-swimming ciliate theronts/trophonts without leaving chemical residues."
                ),
                dosage_or_metric="3 - 5 g/L (0.3% - 0.5% concentration) for 15-30 minutes"
            ))
            priority += 1
            plan.append(PrescriptiveActionItem(
                priority=priority,
                category="Pond Biosecurity",
                title="Equipment Sterilization & Pond Isolation",
                instruction=(
                    "Strictly isolate the affected pond. Disinfect all scoop nets, sampling buckets, and boots "
                    "in potassium permanganate (KMnO4) before using them in adjacent ponds."
                ),
                dosage_or_metric="10 mg/L KMnO4 disinfectant dip"
            ))
            priority += 1

        elif "fin" in c_lower or "tail" in c_lower or "white tail" in c_lower:
            plan.append(PrescriptiveActionItem(
                priority=priority,
                category="Epithelial Support",
                title="Salt Bath & Dietary Vitamin C Boost",
                instruction=(
                    "Immerse visibly fin-frayed fish in a gentle supportive salt bath to stimulate protective mucus production. "
                    "Supplement feed with Vitamin C to accelerate collagen ray regeneration and tissue repair."
                ),
                dosage_or_metric="2 g/L salt bath; 500 mg Vitamin C per kg feed"
            ))
            priority += 1

        elif "columnaris" in c_lower or "saddleback" in c_lower or "gill" in c_lower:
            plan.append(PrescriptiveActionItem(
                priority=priority,
                category="Thermal & Flow Control",
                title="Water Deepening & Surface Circulation",
                instruction=(
                    "Bacterial gill disease and Columnaris virulence escalate in stagnant, hot, alkaline water. "
                    "Increase pond water depth to buffer bottom temperatures and maximize water circulation."
                ),
                dosage_or_metric="Maintain pond depth > 1.3 meters; increase aeration"
            ))
            priority += 1

        elif "saprolegniasis" in c_lower or "fungal" in c_lower:
            plan.append(PrescriptiveActionItem(
                priority=priority,
                category="Anti-Fungal Bath",
                title="Saline Dip & Gentle Handling",
                instruction=(
                    "Immerse cotton-tufted fish in a concentrated salt dip. Minimize physical handling during net checks "
                    "to avoid stripping the epidermal mucus barrier that protects against fungal zoospores."
                ),
                dosage_or_metric="10 g/L salt dip for 10 minutes"
            ))
            priority += 1

        elif "dropsy" in c_lower or "aeromoniasis" in c_lower:
            plan.append(PrescriptiveActionItem(
                priority=priority,
                category="Osmotic Relief",
                title="Epsom Salt (MgSO4) Bath & Segregation",
                instruction=(
                    "Immediately segregate fish exhibiting pinecone scales or abdominal swelling to prevent cannibalism. "
                    "Administer an Epsom salt bath to assist compromised kidneys with osmotic fluid drainage."
                ),
                dosage_or_metric="1 - 2 g/L Magnesium Sulfate (Epsom salt)"
            ))
            priority += 1

        elif "ulcerative" in c_lower or "eus" in c_lower or "red" in c_lower:
            plan.append(PrescriptiveActionItem(
                priority=priority,
                category="Biosecurity Alert",
                title="Potassium Permanganate Pond Treatment & Liming",
                instruction=(
                    "Treat pond with potassium permanganate to oxidize waterborne fungal zoospores and opportunistic bacteria. "
                    "Apply quicklime along pond embankments to halt regional spore transmission."
                ),
                dosage_or_metric="2 mg/L KMnO4 pond-wide; 250 kg/ha quicklime"
            ))
            priority += 1

        elif "healthy" in c_lower:
            plan.append(PrescriptiveActionItem(
                priority=priority,
                category="Preventative Maintenance",
                title="Routine Water Quality Logging & Biosecurity",
                instruction=(
                    "Pond ecosystem and fish morphology are in stable equilibrium. Continue morning and evening "
                    "dissolved oxygen logging and maintain biosecurity protocols."
                ),
                dosage_or_metric="Twice-daily DO & pH checks"
            ))
            priority += 1

        return plan

advisory_service = PrescriptiveAdvisoryService()

