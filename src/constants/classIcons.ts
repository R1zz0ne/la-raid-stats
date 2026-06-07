// Lost Ark Raid Tracker - Class Icons Mapping
// ==========================================

import aeromancer from '@/assets/classes/aeromancer.webp'
import arcanist from '@/assets/classes/arcanist.webp'
import artillerist from '@/assets/classes/artillerist.webp'
import artist from '@/assets/classes/artist.webp'
import bard from '@/assets/classes/bard.webp'
import berserker from '@/assets/classes/berserker.webp'
import breaker from '@/assets/classes/breaker.webp'
import deadeye from '@/assets/classes/deadeye.webp'
import deathblade from '@/assets/classes/deathblade.webp'
import destroyer from '@/assets/classes/destroyer.webp'
import glaivier from '@/assets/classes/glaivier.webp'
import guardianknight from '@/assets/classes/guardianknight.webp'
import gunlancer from '@/assets/classes/gunlancer.webp'
import gunslinger from '@/assets/classes/gunslinger.webp'
import machinist from '@/assets/classes/machinist.webp'
import paladin from '@/assets/classes/paladin.webp'
import reaper from '@/assets/classes/reaper.webp'
import scrapper from '@/assets/classes/scrapper.webp'
import shadowhunter from '@/assets/classes/shadowhunter.webp'
import sharpshooter from '@/assets/classes/sharpshooter.webp'
import slayer from '@/assets/classes/slayer.webp'
import sorceress from '@/assets/classes/sorceress.webp'
import souleater from '@/assets/classes/souleater.webp'
import soulfist from '@/assets/classes/soulfist.webp'
import striker from '@/assets/classes/striker.webp'
import summoner from '@/assets/classes/summoner.webp'
import valkyrie from '@/assets/classes/valkyrie.webp'
import wardancer from '@/assets/classes/wardancer.webp'
import wildsoul from '@/assets/classes/wildsoul.webp'

export const CLASS_ICONS: Record<string, string> = {
  aeromancer,
  arcanist,
  artillerist,
  artist,
  bard,
  berserker,
  breaker,
  deadeye,
  deathblade,
  destroyer,
  glaivier,
  guardianknight,
  gunlancer,
  gunslinger,
  machinist,
  paladin,
  reaper,
  scrapper,
  shadowhunter,
  sharpshooter,
  slayer,
  sorceress,
  souleater,
  soulfist,
  striker,
  summoner,
  valkyrie,
  wardancer,
  wildsoul,
}

// Get icon URL for a character class
export function getClassIcon(characterClass: string): string | undefined {
  return CLASS_ICONS[characterClass]
}