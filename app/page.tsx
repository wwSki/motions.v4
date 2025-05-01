"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Copy, Filter, Info, Moon, Sun, Shuffle, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface Motion {
  Moțiune?: string
  TEMA?: string
  "TEMA 1"?: string
  "TEMA 2"?: string
  "TEMA 3"?: string
  "Tema 1"?: string
  "Tema 2"?: string
  "Tema 3"?: string
  LIMBA?: string
  NIVEL?: string
  "Nume Comp."?: string
  "INFOs."?: string
  "P/I"?: string
  Data?: string
  "CA Team"?: string
  number?: number
}

interface ThemeMapping {
  key: string
  representativeTheme: string
  displayName: string
}

interface CompetitionMapping {
  key: string
  displayName: string
  aliases: string[]
}

export default function MotionGenerator() {
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [currentTab, setCurrentTab] = useState("random")
  const [motionsData, setMotionsData] = useState<Motion[]>([])
  const [filteredMotions, setFilteredMotions] = useState<Motion[]>([])
  const [displayedMotions, setDisplayedMotions] = useState<Motion[]>([])
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const { toast } = useToast()

  // Filter states
  const [selectedTheme, setSelectedTheme] = useState("all")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("both")
  const [selectedCompetition, setSelectedCompetition] = useState("all")
  const [selectedInfoslide, setSelectedInfoslide] = useState("both")
  const [selectedPreparation, setSelectedPreparation] = useState("all")
  const [motionWordFilter, setMotionWordFilter] = useState("")
  const [infoslideWordFilter, setInfoslideWordFilter] = useState("")
  const [caTeamWordFilter, setCATeamWordFilter] = useState("")

  const themesMapping: ThemeMapping[] = [
    { key: "Afaceri", representativeTheme: "Afaceri", displayName: "Afaceri" },
    { key: "Arta si Cultura", representativeTheme: "Artă și Cultură", displayName: "Artă și Cultură" },
    { key: "Artă/Cultură", representativeTheme: "Artă și Cultură", displayName: "Artă și Cultură" },
    { key: "Dezvoltare", representativeTheme: "Dezvoltare", displayName: "Dezvoltare" },
    {
      key: "Drepturile Animalelor",
      representativeTheme: "Drepturile Animalelor",
      displayName: "Drepturile Animalelor",
    },
    { key: "Economie", representativeTheme: "Economie și Finanțe", displayName: "Economie și Finanțe" },
    { key: "Economie/Finance", representativeTheme: "Economie și Finanțe", displayName: "Economie și Finanțe" },
    { key: "Educatie", representativeTheme: "Educație", displayName: "Educație" },
    { key: "Educație", representativeTheme: "Educație", displayName: "Educație" },
    { key: "Experienta Umana?", representativeTheme: "Experiență Umană", displayName: "Experiență Umană" },
    { key: "Experiența Umană", representativeTheme: "Experiență Umană", displayName: "Experiență Umană" },
    { key: "Familie", representativeTheme: "Familie", displayName: "Familie" },
    { key: "Feminism", representativeTheme: "Feminism", displayName: "Feminism" },
    { key: "Istorie", representativeTheme: "Istorie", displayName: "Istorie" },
    { key: "Justitie", representativeTheme: "Justiție", displayName: "Justiție" },
    { key: "Justiție", representativeTheme: "Justiție", displayName: "Justiție" },
    { key: "LGBT+", representativeTheme: "LGBT+", displayName: "LGBT+" },
    { key: "Libertati", representativeTheme: "Libertăți", displayName: "Libertăți" },
    { key: "Libertăți", representativeTheme: "Libertăți", displayName: "Libertăți" },
    { key: "LOL", representativeTheme: "LOL", displayName: "LOL" },
    { key: "Mass/Social Media", representativeTheme: "Mass/Social Media", displayName: "Mass/Social Media" },
    { key: "Medicina", representativeTheme: "Medicină", displayName: "Medicină" },
    { key: "Medicină", representativeTheme: "Medicină", displayName: "Medicină" },
    { key: "Mediu", representativeTheme: "Mediu", displayName: "Mediu" },
    { key: "Minoritati", representativeTheme: "Minorități", displayName: "Minorități" },
    { key: "Minorități", representativeTheme: "Minorități", displayName: "Minorități" },
    { key: "Moralitate", representativeTheme: "Moralitate", displayName: "Moralitate" },
    { key: "Politica", representativeTheme: "Politică", displayName: "Politică" },
    { key: "Politică", representativeTheme: "Politică", displayName: "Politică" },
    { key: "Politici Sociale", representativeTheme: "Politici Sociale", displayName: "Politici Sociale" },
    {
      key: "Relatii Internationale",
      representativeTheme: "Relații Internaționale",
      displayName: "Relații Internaționale",
    },
    {
      key: "Relații Internaționale",
      representativeTheme: "Relații Internaționale",
      displayName: "Relații Internaționale",
    },
    { key: "Relații/Cupluri", representativeTheme: "Relații/Cupluri", displayName: "Relații/Cupluri" },
    { key: "Religie", representativeTheme: "Religie", displayName: "Religie" },
    {
      key: "Securitate Razboi si Armata",
      representativeTheme: "Securitate, Război și Armată",
      displayName: "Securitate, Război și Armată",
    },
    {
      key: "Securitate/Război/Armată",
      representativeTheme: "Securitate, Război și Armată",
      displayName: "Securitate, Război și Armată",
    },
    { key: "SF", representativeTheme: "SF", displayName: "SF" },
    { key: "Sport", representativeTheme: "Sport", displayName: "Sport" },
    {
      key: "Stiinta si tehnologie",
      representativeTheme: "Știință și Tehnologie",
      displayName: "Știință și Tehnologie",
    },
    {
      key: "Știință și Tehnologie",
      representativeTheme: "Știință și Tehnologie",
      displayName: "Știință și Tehnologie",
    },
    { key: "Terorism", representativeTheme: "Terorism", displayName: "Terorism" },
    { key: "Trenduri Sociale", representativeTheme: "Trenduri Sociale", displayName: "Trenduri Sociale" },
  ]

  const competitionsMapping: CompetitionMapping[] = [
    { key: "AES Spring Open", displayName: "AES Spring Open", aliases: ["Spring Open", "AES Spring"] },
    { key: "ARGO Masters", displayName: "ARGO Masters", aliases: ["ARGO Masters"] },
    { key: "ARGO Open", displayName: "ARGO Open", aliases: ["ARGO Open"] },
    { key: "ARGO Premiership", displayName: "ARGO Premiership", aliases: ["ARGO Premiership"] },
    { key: "Black Sea Open", displayName: "Black Sea Open", aliases: ["Black Sea Open"] },
    { key: "Brasovul Dezbate", displayName: "Brasovul Dezbate", aliases: ["Brasovul Dezbate"] },
    { key: "BTDR", displayName: "BTDR", aliases: ["BTDR"] },
    { key: "Bucovina Open", displayName: "Bucovina Open", aliases: ["Bucovina Open"] },
    {
      key: "Campina Impropmtu Open",
      displayName: "Campina Impropmtu Open",
      aliases: ["Campina", "Campina Impropmtu Open"],
    },
    {
      key: "Cantemir Debate Extravaganza",
      displayName: "Cantemir Debate Extravaganza",
      aliases: ["Extravaganza", "Cantemir Debate Extravaganza"],
    },
    { key: "CDX", displayName: "CDX", aliases: ["CDX"] },
    { key: "Central Open", displayName: "Central Open", aliases: ["Central Open"] },
    { key: "Chisinau Open", displayName: "Chisinau Open", aliases: ["Chisinau Open"] },
    { key: "Chropen", displayName: "Chropen", aliases: ["Chropen"] },
    { key: "Cluj Open", displayName: "Cluj Open", aliases: ["Cluj Open"] },
    { key: "Cupa Liceelor Prahovene", displayName: "Cupa Liceelor Prahovene", aliases: ["Cupa Liceelor Prahovene"] },
    { key: "Debatopalooza", displayName: "Debatopalooza", aliases: ["Debatopalooza"] },
    { key: "Deva Cup", displayName: "Deva Cup", aliases: ["Deva Cup"] },
    { key: "Deva Open", displayName: "Deva Open", aliases: ["Deva Open"] },
    { key: "Dezbatem Romania", displayName: "Dezbatem Romania", aliases: ["Dezbatem Romania"] },
    { key: "Edu Debate Revolution", displayName: "Edu Debate Revolution", aliases: ["Edu Debate Revolution"] },
    {
      key: "European Schools debating championship",
      displayName: "European Schools debating championship",
      aliases: ["European Schools debating championship"],
    },
    { key: "Fiat!", displayName: "Fiat!", aliases: ["Fiat"] },
    { key: "FNDA", displayName: "FNDA", aliases: ["FNDA", "Forumul National", "Forumul Național", "Forumul"] },
    { key: "Focșani Mixt Team Open", displayName: "Focșani Mixt Team Open", aliases: ["Focșani Mixt Team Open"] },
    { key: "FRDA", displayName: "FRDA", aliases: ["FRDA", "Forumul Regional"] },
    { key: "Funky Debates", displayName: "Funky Debates", aliases: ["Funky Debates", "Funky"] },
    { key: "HD Open", displayName: "HD Open", aliases: ["HD Open"] },
    { key: "Iasi Open", displayName: "Iasi Open", aliases: ["Iasi Open"] },
    {
      key: "Interact Sfântul Sava Debate Competition",
      displayName: "Interact Sfântul Sava Debate Competition",
      aliases: ["Interact Sfântul Sava Debate Competition"],
    },
    {
      key: "InterDebate Timișoara",
      displayName: "InterDebate Timișoara",
      aliases: ["InterDebate Timișoara", "InterDebate"],
    },
    { key: "LDCembrie", displayName: "LDCembrie", aliases: ["LDC"] },
    { key: "MMO", displayName: "MMO", aliases: ["MMO"] },
    { key: "Pache Open", displayName: "Pache Open", aliases: ["Pache"] },
    { key: "Padawans", displayName: "Padawans", aliases: ["Padawans"] },
    { key: "Premiership", displayName: "Premiership", aliases: ["Premiership"] },
    { key: "PTA", displayName: "PTA", aliases: ["PTA"] },
    { key: "Racovita Open", displayName: "Racovita Open", aliases: ["Racovita Open"] },
    { key: "Ramnicu Sarat Open", displayName: "Ramnicu Sarat Open", aliases: ["Ramnicu Sarat Open"] },
    { key: "Regionala Muntenia", displayName: "Regionala Muntenia", aliases: ["Regionala Muntenia"] },
    { key: "Saint George", displayName: "Saint George", aliases: ["Saint George"] },
    { key: "Sava", displayName: "Sava", aliases: ["Sava"] },
    { key: "Selectie WSDC", displayName: "Selectie WSDC", aliases: ["Selectie WSDC"] },
    { key: "Sinaia Mixed Teams Open", displayName: "Sinaia Mixed Teams Open", aliases: ["Sinaia Mixed Teams Open"] },
    { key: "TM Open", displayName: "TM Open", aliases: ["TM Open", "Timisoara Open", "Timișoara Open"] },
    {
      key: "Transilvania College Open",
      displayName: "Transilvania College Open",
      aliases: ["Transilvania College Open"],
    },
    {
      key: "Transylvania New Generation Cup",
      displayName: "Transylvania New Generation Cup",
      aliases: ["Transylvania New Generation Cup"],
    },
    { key: "UN Open", displayName: "UN Open", aliases: ["UN Open"] },
    { key: "UN Youth Open", displayName: "UN Youth Open", aliases: ["UN Youth Open"] },
    { key: "Winter MO", displayName: "Winter MO", aliases: ["Winter MO"] },
    { key: "Zenith Opoen", displayName: "Zenith Opoen", aliases: ["Zenith Opoen"] },
  ]

  // Define fallback data
  const fallbackData: Motion[] = [
    {
      Moțiune: "THW ban the use of animals in entertainment",
      TEMA: "Drepturile Animalelor",
      LIMBA: "Engleza",
      NIVEL: "General",
      "Nume Comp.": "ARGO Open",
      "INFOs.":
        "This motion refers to the use of animals in circuses, zoos, marine parks, and other entertainment venues.",
      "P/I": "Prepared",
      Data: "2023-05-15",
      "CA Team": "John Doe, Jane Smith",
    },
    {
      Moțiune: "TH supports the right to be forgotten online",
      TEMA: "Libertăți",
      LIMBA: "Engleza",
      NIVEL: "General",
      "Nume Comp.": "Cluj Open",
      "INFOs.":
        "The right to be forgotten is the right to have private information removed from Internet searches and other directories under some circumstances.",
      "P/I": "Prepared",
      Data: "2023-06-20",
      "CA Team": "Alex Johnson, Maria Garcia",
    },
    {
      Moțiune: "THBT social media platforms should be held legally responsible for the spread of misinformation",
      TEMA: "Mass/Social Media",
      LIMBA: "Engleza",
      NIVEL: "General",
      "Nume Comp.": "Bucovina Open",
      "INFOs.": "",
      "P/I": "Impromptu",
      Data: "2023-07-10",
      "CA Team": "Robert Brown, Sarah Wilson",
    },
    {
      Moțiune: "THW allow citizens to sell their votes",
      TEMA: "Politică",
      LIMBA: "Engleza",
      NIVEL: "General",
      "Nume Comp.": "FNDA",
      "INFOs.": "",
      "P/I": "Impromptu",
      Data: "2023-08-05",
      "CA Team": "David Miller, Emma Davis",
    },
    {
      Moțiune: "THBT developing nations should prioritize economic growth over environmental protection",
      TEMA: "Mediu",
      LIMBA: "Engleza",
      NIVEL: "General",
      "Nume Comp.": "TM Open",
      "INFOs.":
        "This debate focuses on the trade-off between economic development and environmental sustainability in developing countries.",
      "P/I": "Prepared",
      Data: "2023-09-12",
      "CA Team": "Michael Wilson, Jennifer Taylor",
    },
    {
      Moțiune: "Această Cameră ar interzice publicitatea pentru copii",
      TEMA: "Mass/Social Media",
      LIMBA: "Romana",
      NIVEL: "Incepator",
      "Nume Comp.": "FRDA",
      "INFOs.":
        "Această moțiune se referă la orice formă de publicitate care vizează în mod specific copiii sub 12 ani.",
      "P/I": "Prepared",
      Data: "2024-03-10",
      "CA Team": "Andrei Popescu, Maria Ionescu",
    },
  ]

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = (localStorage.getItem("theme") as "dark" | "light") || "dark"
    setTheme(savedTheme)
    document.documentElement.classList.toggle("dark", savedTheme === "dark")

    // Set initial data with fallback
    setMotionsData(fallbackData)
    setFilteredMotions(fallbackData)
    console.log("Set initial fallback data:", fallbackData.length)

    // Load motions data
    const loadMotions = async () => {
      try {
        console.log("Attempting to fetch motions data...")

        // Use the hardcoded data instead of fetching from file
        // This avoids JSON parsing issues
        console.log("Using hardcoded motion data")
        setMotionsData(fallbackData)
        setFilteredMotions(fallbackData)

        // Notify the user
        toast({
          title: "Date încărcate",
          description: "S-au încărcat datele implicite.",
          duration: 3000,
        })
      } catch (error) {
        console.error("Error loading motions data:", error)
        toast({
          title: "Eroare",
          description: "Nu s-a putut încărca lista de moțiuni. Se folosesc date implicite.",
          variant: "destructive",
        })
        // Already set fallback data above
      }
    }

    loadMotions()
  }, [toast])

  useEffect(() => {
    // Apply filters whenever filter states change
    applyFilters()
  }, [
    selectedTheme,
    selectedLanguage,
    selectedLevel,
    selectedCompetition,
    selectedInfoslide,
    selectedPreparation,
    motionWordFilter,
    infoslideWordFilter,
    caTeamWordFilter,
    showAdvancedFilters,
    motionsData,
  ])

  useEffect(() => {
    // Update displayed motions when tab changes or filtered motions change
    if (currentTab === "list") {
      setDisplayedMotions(filteredMotions.map((m, i) => ({ ...m, number: i + 1 })))
    } else {
      setDisplayedMotions([])
    }
  }, [currentTab, filteredMotions])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  const toggleAdvancedFilters = () => {
    const newState = !showAdvancedFilters
    console.log("Toggling advanced filters:", newState)
    setShowAdvancedFilters(newState)
  }

  const applyFilters = () => {
    if (!motionsData.length) {
      console.log("No motions data to filter")
      return
    }

    console.log("Applying filters to", motionsData.length, "motions")
    console.log("Filter settings:", {
      theme: selectedTheme,
      language: selectedLanguage,
      level: selectedLevel,
      competition: selectedCompetition,
      infoslide: selectedInfoslide,
      preparation: selectedPreparation,
      showAdvancedFilters,
      motionWordFilter,
      infoslideWordFilter,
      caTeamWordFilter,
    })

    const filtered = motionsData.filter((motion) => {
      // Apply base filters
      const themeFilterPassed = checkThemeFilter(motion)
      const languageFilterPassed = checkLanguageFilter(motion)
      const levelFilterPassed = checkLevelFilter(motion)
      const competitionFilterPassed = checkCompetitionFilter(motion)
      const infoslideFilterPassed = checkInfoslideFilter(motion)
      const preparationFilterPassed = checkPreparationFilter(motion)

      const baseFilters =
        themeFilterPassed &&
        languageFilterPassed &&
        levelFilterPassed &&
        competitionFilterPassed &&
        infoslideFilterPassed &&
        preparationFilterPassed

      // If advanced filters are not shown, return base filter result
      if (!showAdvancedFilters) return baseFilters

      // Apply advanced filters
      const motionWordFilterPassed = checkMotionWordFilter(motion)
      const infoslideWordFilterPassed = checkInfoslideWordFilter(motion)
      const caTeamWordFilterPassed = checkCATeamWordFilter(motion)

      return baseFilters && motionWordFilterPassed && infoslideWordFilterPassed && caTeamWordFilterPassed
    })

    console.log("Filtered motions:", filtered.length)
    setFilteredMotions(filtered)
  }

  const checkThemeFilter = (motion: Motion) => {
    if (selectedTheme === "all") return true

    // Get all theme fields from the motion
    const themeFields = [
      motion["TEMA"],
      motion["TEMA 1"],
      motion["TEMA 2"],
      motion["TEMA 3"],
      motion["Tema 1"],
      motion["Tema 2"],
      motion["Tema 3"],
    ].filter(Boolean)

    // Process each theme field, handling comma-separated values
    const motionThemes = themeFields.flatMap((field) => {
      if (!field) return []
      // Handle both comma-separated and non-comma-separated themes
      return field.includes(",") ? field.split(",").map((t) => t.trim()) : [field.trim()]
    })

    // For debugging
    if (motionThemes.length > 0) {
      console.log("Motion themes for:", motion["Moțiune"], motionThemes)
    }

    // Check if any of the motion's themes match the selected theme
    return motionThemes.some((motionTheme) => {
      // Find a matching theme in our mapping
      const matchingTheme = themesMapping.find((theme) => theme.key.toLowerCase() === motionTheme?.toLowerCase())

      // Return true if we found a match and its display name matches the selected theme
      return matchingTheme && matchingTheme.displayName === selectedTheme
    })
  }

  const checkLanguageFilter = (motion: Motion) => {
    return selectedLanguage === "all" || motion.LIMBA?.toLowerCase() === selectedLanguage.toLowerCase()
  }

  const checkLevelFilter = (motion: Motion) => {
    return selectedLevel === "both" || motion.NIVEL?.toLowerCase() === selectedLevel.toLowerCase()
  }

  const checkCompetitionFilter = (motion: Motion) => {
    if (selectedCompetition === "all") return true

    const competition = competitionsMapping.find((c) => c.displayName === selectedCompetition)
    return (
      competition?.aliases.some((alias) => motion["Nume Comp."]?.toLowerCase().includes(alias.toLowerCase())) || false
    )
  }

  const checkInfoslideFilter = (motion: Motion) => {
    if (selectedInfoslide === "both") return true

    const infoFields = Object.keys(motion).filter(
      (key) =>
        key.toLowerCase().includes("info") ||
        key.toLowerCase().includes("infoslide") ||
        key.toLowerCase().includes("context"),
    )

    const combinedContent = infoFields
      .map((field) => (motion[field as keyof Motion] || "").toString().trim())
      .join(" ")
      .trim()

    const hasValidInfo = () => {
      if (combinedContent.length === 0) return false

      const invalidPatterns = [/^none$/i, /^n\/?a$/i, /^-+$/, /^no info$/i, /^not applicable$/i, /^context:?\s*$/i]

      return !invalidPatterns.some((pattern) => pattern.test(combinedContent))
    }

    return selectedInfoslide === "with" ? hasValidInfo() : !hasValidInfo()
  }

  const checkPreparationFilter = (motion: Motion) => {
    return selectedPreparation === "all" || motion["P/I"]?.toLowerCase() === selectedPreparation.toLowerCase()
  }

  const checkMotionWordFilter = (motion: Motion) => {
    const kw = motionWordFilter.trim().toLowerCase()
    return !kw || (motion["Moțiune"] || "").toLowerCase().includes(kw)
  }

  const checkInfoslideWordFilter = (motion: Motion) => {
    const kw = infoslideWordFilter.trim().toLowerCase()
    const text = (motion["INFOs."] || "").toString().toLowerCase()
    return !kw || text.includes(kw)
  }

  const checkCATeamWordFilter = (motion: Motion) => {
    const kw = caTeamWordFilter.trim().toLowerCase()
    const text = (motion["CA Team"] || "").toString().toLowerCase()
    return !kw || text.includes(kw)
  }

  const generateRandomMotion = () => {
    if (filteredMotions.length === 0) {
      toast({
        title: "Nicio moțiune găsită",
        description: "Nu există moțiuni care să corespundă filtrelor selectate.",
        variant: "destructive",
      })
      return
    }

    const randomMotion = filteredMotions[Math.floor(Math.random() * filteredMotions.length)]
    setDisplayedMotions([randomMotion])
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Copiat!",
          description: "Moțiunea a fost copiată în clipboard.",
          duration: 2000,
        })
      })
      .catch((err) => {
        console.error("Error copying to clipboard:", err)
        toast({
          title: "Eroare",
          description: "Nu s-a putut copia moțiunea.",
          variant: "destructive",
        })
      })
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${theme === "dark" ? "from-slate-900 to-slate-800" : "from-slate-100 to-slate-200"}`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-700/20 dark:border-slate-300/10">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Generator de moțiuni</h1>
          <Button variant="outline" size="icon" onClick={toggleTheme} className="rounded-full">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </header>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-1/3 xl:w-1/4">
            <Card className="p-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-lg">
              <Tabs defaultValue="random" onValueChange={setCurrentTab} className="w-full">
                <TabsList className="grid grid-cols-2 mb-4 w-full">
                  <TabsTrigger value="random" className="flex items-center gap-2">
                    <Shuffle className="h-4 w-4" />
                    <span>Random</span>
                  </TabsTrigger>
                  <TabsTrigger value="list" className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                    <span>Listă</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Tema:</Label>
                  <Select id="theme" value={selectedTheme} onChange={(e) => setSelectedTheme(e.target.value)}>
                    <option value="all">Toate</option>
                    {[...new Set(themesMapping.map((t) => t.displayName))].map((theme) => (
                      <option key={theme} value={theme}>
                        {theme}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Limba:</Label>
                  <Select id="language" value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
                    <option value="all">Toate</option>
                    <option value="Engleza">Engleza</option>
                    <option value="Romana">Romana</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Nivel:</Label>
                  <Select id="level" value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
                    <option value="both">Toate</option>
                    <option value="Incepator">Începător</option>
                    <option value="General">General</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="competition">Competiție:</Label>
                  <Select
                    id="competition"
                    value={selectedCompetition}
                    onChange={(e) => setSelectedCompetition(e.target.value)}
                  >
                    <option value="all">Toate</option>
                    {competitionsMapping.map((comp) => (
                      <option key={comp.key} value={comp.displayName}>
                        {comp.displayName}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="infoslide">Infoslide:</Label>
                  <Select
                    id="infoslide"
                    value={selectedInfoslide}
                    onChange={(e) => setSelectedInfoslide(e.target.value)}
                  >
                    <option value="both">Toate</option>
                    <option value="with">Cu infoslide</option>
                    <option value="without">Fără infoslide</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preparation">Pregătire:</Label>
                  <Select
                    id="preparation"
                    value={selectedPreparation}
                    onChange={(e) => setSelectedPreparation(e.target.value)}
                  >
                    <option value="all">Toate</option>
                    <option value="Prepared">Prepared</option>
                    <option value="Impromptu">Impromptu</option>
                  </Select>
                </div>

                {currentTab === "random" && (
                  <Button
                    className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={generateRandomMotion}
                  >
                    <Shuffle className="mr-2 h-4 w-4" />
                    Generează
                  </Button>
                )}

                {/* Advanced filters section - using simple div instead of Collapsible */}
                <div className="mt-4 border-t pt-4 border-slate-200 dark:border-slate-700">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-between"
                    onClick={toggleAdvancedFilters}
                  >
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4" />
                      <span>Filtre avansate</span>
                    </div>
                    {showAdvancedFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>

                  {/* Conditionally render advanced filters */}
                  {showAdvancedFilters && (
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="filterMotionWord">Cuvânt în moțiune:</Label>
                        <Input
                          id="filterMotionWord"
                          placeholder="ex: Joel"
                          value={motionWordFilter}
                          onChange={(e) => setMotionWordFilter(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="filterInfoslideWord">Cuvânt în infoslide:</Label>
                        <Input
                          id="filterInfoslideWord"
                          placeholder="ex: demiurg"
                          value={infoslideWordFilter}
                          onChange={(e) => setInfoslideWordFilter(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="filterCATeamWord">Cuvânt în CA Team:</Label>
                        <Input
                          id="filterCATeamWord"
                          placeholder="ex: Livia Rusu"
                          value={caTeamWordFilter}
                          onChange={(e) => setCATeamWordFilter(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Content */}
          <div className="w-full lg:w-2/3 xl:w-3/4">
            <Card className="p-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-lg min-h-[400px]">
              {displayedMotions.length > 0 ? (
                <div className="space-y-4">
                  {displayedMotions.map((motion, index) => (
                    <MotionCard key={index} motion={motion} onCopy={copyToClipboard} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center text-slate-500 dark:text-slate-400">
                  {currentTab === "random" ? (
                    <>
                      <Shuffle className="h-12 w-12 mb-4 opacity-50" />
                      <p className="text-lg">Apasă butonul "Generează" pentru a obține o moțiune aleatorie</p>
                    </>
                  ) : (
                    <>
                      <List className="h-12 w-12 mb-4 opacity-50" />
                      <p className="text-lg">Nicio moțiune găsită. Încearcă să modifici filtrele.</p>
                    </>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Motion counter */}
        <div className="fixed bottom-6 right-0 z-10">
          <Badge
            variant="secondary"
            className="py-2 px-4 text-sm font-medium rounded-r-none rounded-l-lg bg-emerald-600 text-white"
          >
            Moțiuni găsite: {filteredMotions.length}
          </Badge>
        </div>

        {/* Version */}
        <div className="fixed bottom-2 left-2 text-xs text-slate-500/60 dark:text-slate-400/40 pointer-events-none">
          v.304
        </div>
      </div>
    </div>
  )
}

interface MotionCardProps {
  motion: Motion
  onCopy: (text: string) => void
}

function MotionCard({ motion, onCopy }: MotionCardProps) {
  const [showInfoslide, setShowInfoslide] = useState(false)

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
      <div className="p-4 cursor-pointer relative" onClick={() => motion["Moțiune"] && onCopy(motion["Moțiune"])}>
        {motion.number && (
          <Badge variant="outline" className="absolute top-4 left-4">
            {motion.number}
          </Badge>
        )}

        <div className="ml-8">
          <h3 className="text-xl font-medium mb-2 pr-8">{motion["Moțiune"] || "Fără moțiune"}</h3>

          {motion.Data && <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{motion.Data}</p>}

          <div className="flex justify-between items-center">
            {motion["INFOs."]?.trim() && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowInfoslide(!showInfoslide)
                }}
              >
                <Info className="h-4 w-4" />
                <span>Infoslide</span>
                {showInfoslide ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={(e) => {
                e.stopPropagation()
                motion["Moțiune"] && onCopy(motion["Moțiune"])
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          {showInfoslide && motion["INFOs."]?.trim() && (
            <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500 rounded text-slate-700 dark:text-slate-300">
              {motion["INFOs."]}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
