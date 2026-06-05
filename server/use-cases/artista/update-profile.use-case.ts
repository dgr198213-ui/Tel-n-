import { IArtistRepository } from "./artist.repository";

export interface UpdateProfileDTO {
  nombreArtistico: string;
  bio?: string;
  fotoPrincipal?: string;
  fotosExtra?: string[];
  enlacesVideo?: string[];
  redesSociales?: Record<string, string>;
}

export class UpdateArtistProfileUseCase {
  constructor(private artistRepo: IArtistRepository) {}

  async execute(userId: number, data: UpdateProfileDTO) {
    const artist = await this.artistRepo.findByUserId(userId);
    
    if (!artist) {
      throw new Error("Artist profile not found");
    }

    // Business Logic: Validate limits based on plan
    const limits = this.getPlanLimits(artist.planStatus as 'free' | 'estandar' | 'premium');
    
    if (data.fotosExtra && data.fotosExtra.length > limits.fotos) {
      throw new Error(`Plan limit exceeded: maximum ${limits.fotos} extra photos allowed for ${artist.planStatus} plan.`);
    }

    if (data.enlacesVideo && data.enlacesVideo.length > limits.videos) {
      throw new Error(`Plan limit exceeded: maximum ${limits.videos} videos allowed for ${artist.planStatus} plan.`);
    }

    return this.artistRepo.update(userId, data);
  }

  private getPlanLimits(planStatus: 'free' | 'estandar' | 'premium') {
    const limits = {
      free: { fotos: 1, videos: 0 },
      estandar: { fotos: 3, videos: 1 },
      premium: { fotos: 3, videos: 3 },
    };
    return limits[planStatus];
  }
}
