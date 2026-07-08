import {
  AcuraLogo, AlfaRomeoLogo, AstonMartinLogo, AudiLogo, BentleyLogo, 
  BMWLogo, BuickLogo, CadillacLogo, ChevroletLogo, ChryslerLogo, 
  DodgeLogo, FerrariLogo, FiatLogo, FordLogo, GenesisLogo, GMCLogo, 
  HondaLogo, HyundaiLogo, InfinitiLogo, JaguarLogo, JeepLogo, KiaLogo, 
  LamborghiniLogo, LandroverLogo, LexusLogo, LincolnLogo, MaseratiLogo, 
  MazdaLogo, MclarenLogo, MiniLogo, MitsubishiLogo, NissanLogo,
  PorscheLogo, RAMLogo, RollsRoyceLogo, SubaruLogo, TeslaLogo, 
  ToyotaLogo, VolkswagenLogo, VolvoLogo
} from '@cardog-icons/react';

import { SiPeugeot, SiRenault, SiSuzuki } from 'react-icons/si';

interface BrandLogoProps {
  make: string;
  className?: string;
}

export default function BrandLogo({ make, className = "w-10 h-10" }: BrandLogoProps) {
  const normalizedMake = make.toLowerCase().replace(/[^a-z0-9]/g, '');

  switch (normalizedMake) {
    case 'acura': return <AcuraLogo className={className} />;
    case 'alfaromeo': return <AlfaRomeoLogo className={className} />;
    case 'astonmartin': return <AstonMartinLogo className={className} />;
    case 'audi': return <AudiLogo className={className} />;
    case 'bentley': return <BentleyLogo className={className} />;
    case 'bmw': return <BMWLogo className={className} />;
    case 'buick': return <BuickLogo className={className} />;
    case 'cadillac': return <CadillacLogo className={className} />;
    case 'chevrolet': return <ChevroletLogo className={className} />;
    case 'chrysler': return <ChryslerLogo className={className} />;
    case 'dodge': return <DodgeLogo className={className} />;
    case 'ferrari': return <FerrariLogo className={className} />;
    case 'fiat': return <FiatLogo className={className} />;
    case 'ford': return <FordLogo className={className} />;
    case 'genesis': return <GenesisLogo className={className} />;
    case 'gmc': return <GMCLogo className={className} />;
    case 'honda': return <HondaLogo className={className} />;
    case 'hyundai': return <HyundaiLogo className={className} />;
    case 'infiniti': return <InfinitiLogo className={className} />;
    case 'jaguar': return <JaguarLogo className={className} />;
    case 'jeep': return <JeepLogo className={className} />;
    case 'kia': return <KiaLogo className={className} />;
    case 'lamborghini': return <LamborghiniLogo className={className} />;
    case 'landrover': return <LandroverLogo className={className} />;
    case 'lexus': return <LexusLogo className={className} />;
    case 'lincoln': return <LincolnLogo className={className} />;
    case 'maserati': return <MaseratiLogo className={className} />;
    case 'mazda': return <MazdaLogo className={className} />;
    case 'mclaren': return <MclarenLogo className={className} />;
    case 'mercedesbenz': 
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 1.5c4.69 0 8.5 3.81 8.5 8.5 0 1.25-.27 2.44-.76 3.51l-7.38-6.15v-5.74c-.12-.01-.24-.02-.36-.02s-.24.01-.36.02v5.74L4.26 15.51A8.47 8.47 0 013.5 12c0-4.69 3.81-8.5 8.5-8.5zm-.75 6.94l6.65 5.54c-1.34 1.83-3.48 3.02-5.9 3.02-1.92 0-3.69-.64-5.11-1.72l4.36-6.84zm1.5 0l4.36 6.84c-1.42 1.08-3.19 1.72-5.11 1.72-2.42 0-4.56-1.19-5.9-3.02l6.65-5.54z"/>
        </svg>
      );
    case 'mini': return <MiniLogo className={className} />;
    case 'mitsubishi': return <MitsubishiLogo className={className} />;
    case 'nissan': return <NissanLogo className={className} />;
    case 'peugeot': return <SiPeugeot className={className} />;
    case 'porsche': return <PorscheLogo className={className} />;
    case 'ram': return <RAMLogo className={className} />;
    case 'renault': return <SiRenault className={className} />;
    case 'rollsroyce': return <RollsRoyceLogo className={className} />;
    case 'subaru': return <SubaruLogo className={className} />;
    case 'suzuki': return <SiSuzuki className={className} />;
    case 'tesla': return <TeslaLogo className={className} />;
    case 'toyota': return <ToyotaLogo className={className} />;
    case 'volkswagen': return <VolkswagenLogo className={className} />;
    case 'volvo': return <VolvoLogo className={className} />;
    default:
      const initial = make.charAt(0).toUpperCase();
      return (
        <div className={`flex items-center justify-center rounded-full bg-gradient-to-br from-slate-300 to-slate-600 shadow-inner border-2 border-slate-700/50 ${className}`}>
          <div className="w-[85%] h-[85%] rounded-full bg-[#1a233a] flex items-center justify-center">
            <span className="font-bold text-slate-300">{initial}</span>
          </div>
        </div>
      );
  }
}
