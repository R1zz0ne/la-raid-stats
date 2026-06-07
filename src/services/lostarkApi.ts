// Lost Ark Raid Tracker - LostArk Armory API Service
// ==================================================

import type { CharacterClass } from '@/types'

export interface ArmoryCharacter {
  name: string
  characterClass: CharacterClass
  server: string
  serverId: string
  gearScore?: number
}

export interface ArmoryResponse {
  characters: ArmoryCharacter[]
  mainCharacter: string
  legacyLevel: number
}

// Custom error for character not found
export class CharacterNotFoundError extends Error {
  constructor(characterName: string) {
    super(`Персонаж "${characterName}" не найден. Проверьте правильность имени.`)
    this.name = 'CharacterNotFoundError'
  }
}

// Mapping from armory class icon filenames to CharacterClass
const CLASS_ICON_MAP: Record<string, CharacterClass> = {
  // Standard thumb icons
  berserker: 'berserker',
  destroyer: 'destroyer',
  gunlancer: 'gunlancer',
  paladin: 'paladin',
  slayer: 'slayer',
  valkyrie: 'valkyrie',
  holyknight_female: 'valkyrie',
  arcanist: 'arcanist',
  summoner: 'summoner',
  bard: 'bard',
  sorceress: 'sorceress',
  wardancer: 'wardancer',
  battle_master: 'wardancer',
  scrapper: 'scrapper',
  soulfist: 'soulfist',
  force_master: 'soulfist',
  glaivier: 'glaivier',
  striker: 'striker',
  breaker: 'breaker',
  sharpshooter: 'sharpshooter',
  hawk_eye: 'sharpshooter',
  deadeye: 'deadeye',
  artillerist: 'artillerist',
  machinist: 'machinist',
  gunslinger: 'gunslinger',
  deathblade: 'deathblade',
  blade: 'deathblade',
  shadowhunter: 'shadowhunter',
  reaper: 'reaper',
  souleater: 'souleater',
  soul_eater: 'souleater',
  artist: 'artist',
  aeromancer: 'aeromancer',
  // Emblem icons (full-size)
  emblem_berserker: 'berserker',
  emblem_destroyer: 'destroyer',
  emblem_gunlancer: 'gunlancer',
  emblem_paladin: 'paladin',
  emblem_slayer: 'slayer',
  emblem_valkyrie: 'valkyrie',
  emblem_holyknight_female: 'valkyrie',
  emblem_arcanist: 'arcanist',
  emblem_summoner: 'summoner',
  emblem_bard: 'bard',
  emblem_sorceress: 'sorceress',
  emblem_wardancer: 'wardancer',
  emblem_battle_master: 'wardancer',
  emblem_scrapper: 'scrapper',
  emblem_soulfist: 'soulfist',
  emblem_force_master: 'soulfist',
  emblem_glaivier: 'glaivier',
  emblem_striker: 'striker',
  emblem_breaker: 'breaker',
  emblem_sharpshooter: 'sharpshooter',
  emblem_hawk_eye: 'sharpshooter',
  emblem_deadeye: 'deadeye',
  emblem_artillerist: 'artillerist',
  emblem_machinist: 'machinist',
  emblem_gunslinger: 'gunslinger',
  emblem_deathblade: 'deathblade',
  emblem_blade: 'deathblade',
  emblem_shadowhunter: 'shadowhunter',
  emblem_reaper: 'reaper',
  emblem_souleater: 'souleater',
  emblem_soul_eater: 'souleater',
  emblem_artist: 'artist',
  emblem_aeromancer: 'aeromancer',
  wildsoul: 'wildsoul',
  alchemist: 'wildsoul',
  guardianknight: 'guardianknight',
  yinyangshi: 'artist',
}

/**
 * Fetch and parse character list from Lost Ark Armory
 * @param characterName - The name of any character on the account
 * @returns Promise with list of all characters on the account
 */
export async function fetchArmoryCharacters(characterName: string): Promise<ArmoryResponse> {
  const encodedName = encodeURIComponent(characterName)
  const baseUrl = 'https://xn--80aubmleh.xn--p1ai/%D0%9E%D1%80%D1%83%D0%B6%D0%B5%D0%B9%D0%BD%D0%B0%D1%8F/'

  // CORS proxy
  const proxy = 'https://corsproxy.io/?'

  try {
    const targetUrl = `${proxy}${encodeURIComponent(`${baseUrl}${encodedName}`)}`

    const response = await fetch(targetUrl, {
      headers: {
        'Accept': 'text/html',
      },
    })

    if (!response.ok) {
      throw new Error('Не удалось загрузить данные персонажа')
    }
    
    const reader = response.body!.getReader()
    const decoder = new TextDecoder()
    let html = ''
    let chunksReceived = 0
    
    // Read chunks with timeout
    let consecutiveEmpty = 0
    const startTime = Date.now()
    const maxTotalTime = 60000 // 60 seconds max
    
    while (true) {
      // Check total timeout
      if (Date.now() - startTime > maxTotalTime) {
        break
      }
      
      try {
        const result = await Promise.race([
          reader.read(),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Chunk timeout 5s')), 5000))
        ])
        
        if (result.done) {
          break
        }
        
        if (result.value && result.value.length > 0) {
          html += decoder.decode(result.value, { stream: true })
          chunksReceived++
          consecutiveEmpty = 0
          
          // Check if we have complete character list
          if (html.includes('<button type="button" class="button button--profile-character-close"')) {
            break
          }
        } else {
          consecutiveEmpty++
        }
      } catch (chunkError) {
        // Check if we have complete HTML by looking for close button
        if (html.includes('<button type="button" class="button button--profile-character-close"')) {
          break
        } else if (html.includes('</html>')) {
          break
        } else {
          throw new Error('Не удалось загрузить полные данные персонажа')
        }
      }
    }
    
    // Ensure reader is released
    try {
      reader.releaseLock()
    } catch {
      // Ignore if already released
    }
    
    // Final decode
    html += decoder.decode(undefined, { stream: false })

    let result = null
    try {
      result = parseArmoryHtml(html, characterName)
    } catch (e) {
      throw e
    }

    if (result) {
      return result
    } else {
      throw new Error('Не удалось распознать данные персонажа')
    }
  } catch (error) {
    // If it's a CharacterNotFoundError, rethrow it
    if (error instanceof CharacterNotFoundError) {
      throw error
    }
    throw error
  }
}

/**
 * Parse the armory HTML to extract character information
 * @throws CharacterNotFoundError if character is not found
 */
function parseArmoryHtml(html: string, searchedName: string): ArmoryResponse | null {
  // Check if character not found
  if (html.includes('profile-attention')) {
    const notFoundMatch = html.match(/<span>Персонаж <em>([^<]+)<\/em> не найден\.<\/span>/)
    if (notFoundMatch) {
      throw new CharacterNotFoundError(searchedName)
    }
  }

  // Parse the character list section - capture EVERYTHING until closing </div> of expand-character-list
  // The close button is OUTSIDE the list div
  let characterListMatch = html.match(/<div id="expand-character-list"[^>]*>([\s\S]*?)<\/div>\s*<button[^>]*class="[^"]*profile-character-close"/)
  
  // If not found, try without the close button requirement
  if (!characterListMatch) {
    characterListMatch = html.match(/<div id="expand-character-list"[^>]*>([\s\S]*?)<\/div>/)
  }
  
  // If still not found, try with profile-character-list class
  if (!characterListMatch) {
    characterListMatch = html.match(/<div class="profile-character-list"[^>]*>([\s\S]*?)<\/div>/)
  }

  if (!characterListMatch) {
    return null
  }

  const listSection = characterListMatch[1]

  // Extract server of the searched character
  const mainServerMatch = html.match(/<span class="profile-character-info__server"[^>]*title="([^"]+)">/)
  const mainServer = mainServerMatch?.[1] ?? ''

  // Extract main character info from header
  const mainCharMatch = html.match(/<span class="profile-character-info__name"[^>]*title="([^"]+)">/)
  const mainCharacter = mainCharMatch?.[1] ?? searchedName

  // Extract legacy level
  const legacyMatch = html.match(/<div class="level-info__expedition">[\s\S]*?<small>Ур\.<\/small>(\d+)/)
  const legacyLevel = legacyMatch ? parseInt(legacyMatch[1], 10) : 0

  // Extract main character info (gear score and class from header)
  // Pattern: <span>Текущий рейтинг снаряжения</span><span><small>Ур.</small>1,760<small>.83</small></span>
  const mainGsMatch = html.match(/Текущий рейтинг снаряжения<\/span>\s*<span><small>Ур\.<\/small>\s*([\d,]+)<small>\.(\d+)<\/small>/)
  const mainGearScore = mainGsMatch
    ? parseFloat(`${mainGsMatch[1].replace(',', '')}.${mainGsMatch[2]}`)
    : 0

  // Extract main character class - look for emblem or thumb
  const mainClassMatch = html.match(/<span class="profile-character-info__img">[\s\S]*?<img src="[^"]*\/thumb\/([^"/]+)\.png"/)
  const mainClassIcon = mainClassMatch?.[1] ?? 'berserker'
  const mainCharacterClass = CLASS_ICON_MAP[mainClassIcon] ?? 'berserker'

  // Start with empty array - we'll parse main character from listSection like others
  const characters: ArmoryCharacter[] = []

  // Find all server sections using matchAll
  // First pattern: server + content until next server OR close button
  // Uses lookahead to stop before next server, but also handles last server
  const serverPattern = /<strong class="profile-character-list__server">(@[^<]+)<\/strong>([\s\S]*?)(?=<strong class="profile-character-list__server">|<button[^>]*profile-character-close)/g
  
  interface ServerMatch {
    0: string
    1: string
    2: string
    index?: number
  }
  
  const serverMatches: ServerMatch[] = [...listSection.matchAll(serverPattern)].map(m => ({
    0: m[0],
    1: m[1],
    2: m[2],
  }))
    
   // Also get the last server section (everything after last server until close button)
  // This regex captures server name and all content until close button
  const lastServerMatch = listSection.match(/<strong class="profile-character-list__server">(@[^<]+)<\/strong>([\s\S]*?)<button[^>]*class="[^"]*profile-character-close"/)
  
  if (lastServerMatch) {
    // If last server match is not in serverMatches, add it
    const lastServer = lastServerMatch[1]
    
    let found = false
    for (const match of serverMatches) {
      if (match[1] === lastServer) {
        found = true
        break
      }
    }
    
    if (!found) {
      serverMatches.push({
        0: lastServerMatch[0],
        1: lastServerMatch[1],
        2: lastServerMatch[2],
      })
    }
  }
  
  for (const match of serverMatches) {
    const server = match[1].trim()
    const serverId = server.replace('@', '')
    const sectionContent = match[2] ?? ''
    
    // Skip if this is not the same server as the main character
    if (server !== mainServer) {
      continue
    }

    // Extract all characters in this section
    // Pattern: <img src=".../thumb/CLASS.png" ...>Ур.LEVEL<span>NAME</span>
    const charRegex = /<img src="[^"]*\/thumb\/([^"/]+)\.png"[^>]*>Ур\.\d+<span>([^<]+)<\/span>/g
    const charMatches = [...(sectionContent ?? '').matchAll(charRegex)]
    
    for (const charMatch of charMatches) {
      const [, classIcon, name] = charMatch

      const characterClass = CLASS_ICON_MAP[classIcon] ?? 'berserker'

      characters.push({
        name,
        characterClass,
        server,
        serverId,
      })
    }
  }

  // Update main character's gear score and class
  const mainCharIndex = characters.findIndex(c => c.name.toLowerCase() === mainCharacter.toLowerCase())
  if (mainCharIndex !== -1) {
    characters[mainCharIndex].gearScore = mainGearScore
    characters[mainCharIndex].characterClass = mainCharacterClass
  }

  return {
    characters,
    mainCharacter,
    legacyLevel,
  }
}

/**
 * Validate that a character name exists on the armory
 */
export async function validateCharacterName(characterName: string): Promise<boolean> {
  try {
    const response = await fetchArmoryCharacters(characterName)
    return response.characters.length > 0
  } catch {
    return false
  }
}

/**
 * Fetch gear score for a single character with streaming (early exit)
 * @param characterName - Character name
 * @returns Gear score as number (e.g., 1760.83)
 */
export async function fetchCharacterGearScore(characterName: string): Promise<number | null> {
  const encodedName = encodeURIComponent(characterName)
  const baseUrl = 'https://xn--80aubmleh.xn--p1ai/%D0%9E%D1%80%D1%83%D0%B6%D0%B5%D0%B9%D0%BD%D0%B0%D1%8F/'
  const proxy = 'https://corsproxy.io/?'

  try {
    const targetUrl = `${proxy}${encodeURIComponent(`${baseUrl}${encodedName}`)}`

    const response = await fetch(targetUrl, {
      headers: {
        'Accept': 'text/html',
      },
    })

    if (!response.ok) {
      return null
    }

    // Use streaming to get just enough data for GS (it's early in the HTML)
    const reader = response.body!.getReader()
    const decoder = new TextDecoder()
    let html = ''
    
    while (true) {
      const result = await reader.read()
      
      if (result.done) {
        break
      }
      
      html += decoder.decode(result.value, { stream: true })
      
      // Check if we have the GS value yet
      const gsMatch = html.match(/Текущий рейтинг снаряжения<\/span>\s*<span><small>Ур\.<\/small>\s*([\d,]+)<small>\.(\d+)<\/small>/)
      
      if (gsMatch) {
        const whole = gsMatch[1].replace(',', '')
        const decimal = gsMatch[2]
        const gs = parseFloat(`${whole}.${decimal}`)
        reader.releaseLock()
        return gs
      }
      
      // If we have enough data but no GS, give up
      if (html.length > 10000) {
        break
      }
    }
    
    reader.releaseLock()
    
    return null
  } catch (error) {
    return null
  }
}

/**
 * Fetch gear scores for multiple characters in batch
 * @param characters - Array of character names
 * @param onProgress - Callback for progress updates
 * @returns Map of character name to gear score
 */
export async function fetchGearScoresBatch(
  characters: string[],
  onProgress?: (current: number, total: number) => void
): Promise<Map<string, number>> {
  const results = new Map<string, number>()
  
  for (let i = 0; i < characters.length; i++) {
    const name = characters[i]
    const gs = await fetchCharacterGearScore(name)
    
    if (gs !== null) {
      results.set(name, gs)
    }
    
    onProgress?.(i + 1, characters.length)
    
    // Delay between requests to avoid rate limiting
    if (i < characters.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
  
  return results
}