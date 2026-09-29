import { extraKeys, extraRows, type ExtraKey } from './extra';

export const localeNames = {
  en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch', pt: 'Português',
  it: 'Italiano', nl: 'Nederlands', pl: 'Polski', sv: 'Svenska', da: 'Dansk',
  no: 'Norsk', fi: 'Suomi', ja: '日本語', ko: '한국어', 'zh-CN': '简体中文',
  'zh-TW': '繁體中文', ar: 'العربية', he: 'עברית', tr: 'Türkçe', id: 'Bahasa Indonesia',
} as const;

export type Locale = keyof typeof localeNames;

export const universalMessages = { a4: 'A4', usLetter: 'US Letter', proPlan: 'Pro', businessPlan: 'Business' } as const;

export const keys = [
  'appName','overview','forms','submissions','templates','automations','logs','settings','billing','help',
  'getStarted','onboardingHint','setupProgress','complete','actionRequired','verifyForms','selectForm','chooseTemplate','configurePdf','testPdf','enableAutomatic','configureDelivery',
  'formsRequired','formsRequiredHint','refresh','noForms','noSubmissions','noTemplates','noLogs','noPdfs',
  'submissionDate','submitter','status','actions','view','generate','preview','download','save','cancel','createTemplate','templateName','language','currentPlan','usageThisMonth','generatedPdfs','activeAutomations','failedAutomations','retry','search',
  'loading','errorGeneric','saved','generated','offline','online','automaticPdfs','enabled','disabled','waitingForSubmission','back','open','form','field','answer','file','signature','email','images','details','recentSubmissions','recentPdfs','quickActions','setupComplete','hideChecklist','showChecklist','upgrade','select','configure','delete','duplicate',
] as const;

export type MessageKey = typeof keys[number] | ExtraKey | keyof typeof universalMessages;

const rows: Record<Locale, string[]> = {
  en: [
    'Forms PDF','Overview','Forms','Submissions','PDF Templates','Automations','Automation Logs','Settings','Billing','Help',
    'Get Started','Complete these steps to start generating PDFs from your Wix Form submissions.','Setup progress','Completed','Action required','Verify Wix Forms','Select a form','Choose a PDF template','Configure PDF content','Generate a test PDF','Enable automatic PDFs','Configure delivery',
    'Wix Forms required','Add or configure Wix Forms on this site, then refresh.','Refresh','No forms found','No submissions found','No templates yet','No automation logs','No PDFs yet',
    'Submission date','Submitter','Status','Actions','View','Generate PDF','Preview','Download','Save','Cancel','Create template','Template name','Language','Current plan','PDFs this month','PDFs generated','Active automations','Failed automations','Retry','Search',
    'Loading','Something went wrong','Saved','PDF generated','You are offline. Some features may be unavailable.','You are back online.','Automatic PDFs','Enabled','Disabled','Waiting for a submission','Back','Open','Form','Field','Answer','File','Signature','Email','Images','Details','Recent submissions','Recent PDFs','Quick actions','You are ready to go','Hide completed checklist','Show checklist','Upgrade','Select','Configure','Delete','Duplicate',
  ],
  es: [
    'Forms PDF','Resumen','Formularios','Envíos','Plantillas PDF','Automatizaciones','Registros de automatización','Configuración','Facturación','Ayuda',
    'Comenzar','Complete estos pasos para generar PDF de los envíos de Wix Forms.','Progreso de configuración','Completado','Acción necesaria','Verificar Wix Forms','Seleccionar un formulario','Elegir una plantilla PDF','Configurar el contenido PDF','Generar un PDF de prueba','Activar PDF automáticos','Configurar la entrega',
    'Se requiere Wix Forms','Añada o configure Wix Forms en este sitio y actualice.','Actualizar','No se encontraron formularios','No se encontraron envíos','Aún no hay plantillas','No hay registros de automatización','Aún no hay PDF',
    'Fecha de envío','Remitente','Estado','Acciones','Ver','Generar PDF','Vista previa','Descargar','Guardar','Cancelar','Crear plantilla','Nombre de plantilla','Idioma','Plan actual','PDF de este mes','PDF generados','Automatizaciones activas','Automatizaciones fallidas','Reintentar','Buscar',
    'Cargando','Algo salió mal','Guardado','PDF generado','Está sin conexión. Algunas funciones pueden no estar disponibles.','Ha vuelto a estar en línea.','PDF automáticos','Activado','Desactivado','Esperando un envío','Volver','Abrir','Formulario','Campo','Respuesta','Archivo','Firma','Correo','Imágenes','Detalles','Envíos recientes','PDF recientes','Acciones rápidas','Todo está listo','Ocultar lista completada','Mostrar lista','Mejorar plan','Seleccionar','Configurar','Eliminar','Duplicar',
  ],
  fr: [
    'Forms PDF','Vue d’ensemble','Formulaires','Soumissions','Modèles PDF','Automatisations','Journaux d’automatisation','Paramètres','Facturation','Aide',
    'Commencer','Suivez ces étapes pour générer des PDF à partir des soumissions Wix Forms.','Progression','Terminé','Action requise','Vérifier Wix Forms','Sélectionner un formulaire','Choisir un modèle PDF','Configurer le contenu PDF','Générer un PDF test','Activer les PDF automatiques','Configurer la livraison',
    'Wix Forms requis','Ajoutez ou configurez Wix Forms sur ce site, puis actualisez.','Actualiser','Aucun formulaire trouvé','Aucune soumission trouvée','Aucun modèle','Aucun journal d’automatisation','Aucun PDF',
    'Date de soumission','Expéditeur','Statut','Actions','Voir','Générer un PDF','Aperçu','Télécharger','Enregistrer','Annuler','Créer un modèle','Nom du modèle','Langue','Forfait actuel','PDF ce mois-ci','PDF générés','Automatisations actives','Automatisations échouées','Réessayer','Rechercher',
    'Chargement','Une erreur s’est produite','Enregistré','PDF généré','Vous êtes hors ligne. Certaines fonctions peuvent être indisponibles.','Vous êtes de nouveau en ligne.','PDF automatiques','Activé','Désactivé','En attente d’une soumission','Retour','Ouvrir','Formulaire','Champ','Réponse','Fichier','Signature','E-mail','Images','Détails','Soumissions récentes','PDF récents','Actions rapides','Tout est prêt','Masquer la liste terminée','Afficher la liste','Mettre à niveau','Sélectionner','Configurer','Supprimer','Dupliquer',
  ],
  de: [
    'Forms PDF','Übersicht','Formulare','Einreichungen','PDF-Vorlagen','Automatisierungen','Automatisierungsprotokolle','Einstellungen','Abrechnung','Hilfe',
    'Erste Schritte','Schließen Sie diese Schritte ab, um PDFs aus Wix Forms-Einreichungen zu erstellen.','Einrichtungsfortschritt','Abgeschlossen','Aktion erforderlich','Wix Forms prüfen','Formular auswählen','PDF-Vorlage wählen','PDF-Inhalt konfigurieren','Test-PDF erstellen','Automatische PDFs aktivieren','Zustellung konfigurieren',
    'Wix Forms erforderlich','Fügen Sie Wix Forms zu dieser Website hinzu oder konfigurieren Sie es und aktualisieren Sie.','Aktualisieren','Keine Formulare gefunden','Keine Einreichungen gefunden','Noch keine Vorlagen','Keine Automatisierungsprotokolle','Noch keine PDFs',
    'Einreichungsdatum','Absender','Status','Aktionen','Ansehen','PDF erstellen','Vorschau','Herunterladen','Speichern','Abbrechen','Vorlage erstellen','Vorlagenname','Sprache','Aktueller Plan','PDFs diesen Monat','Erstellte PDFs','Aktive Automatisierungen','Fehlgeschlagene Automatisierungen','Erneut versuchen','Suchen',
    'Laden','Ein Fehler ist aufgetreten','Gespeichert','PDF erstellt','Sie sind offline. Einige Funktionen sind möglicherweise nicht verfügbar.','Sie sind wieder online.','Automatische PDFs','Aktiviert','Deaktiviert','Warten auf eine Einreichung','Zurück','Öffnen','Formular','Feld','Antwort','Datei','Unterschrift','E-Mail','Bilder','Details','Neueste Einreichungen','Neueste PDFs','Schnellaktionen','Alles ist bereit','Abgeschlossene Liste ausblenden','Liste anzeigen','Upgrade','Auswählen','Konfigurieren','Löschen','Duplizieren',
  ],
  pt: [
    'Forms PDF','Visão geral','Formulários','Envios','Modelos PDF','Automações','Registos de automação','Definições','Faturação','Ajuda',
    'Começar','Conclua estes passos para gerar PDF dos envios do Wix Forms.','Progresso da configuração','Concluído','Ação necessária','Verificar Wix Forms','Selecionar um formulário','Escolher um modelo PDF','Configurar conteúdo PDF','Gerar PDF de teste','Ativar PDF automáticos','Configurar entrega',
    'Wix Forms necessário','Adicione ou configure o Wix Forms neste site e atualize.','Atualizar','Nenhum formulário encontrado','Nenhum envio encontrado','Ainda não há modelos','Sem registos de automação','Ainda não há PDF',
    'Data do envio','Remetente','Estado','Ações','Ver','Gerar PDF','Pré-visualizar','Transferir','Guardar','Cancelar','Criar modelo','Nome do modelo','Idioma','Plano atual','PDF este mês','PDF gerados','Automações ativas','Automações falhadas','Tentar novamente','Pesquisar',
    'A carregar','Ocorreu um erro','Guardado','PDF gerado','Está offline. Algumas funcionalidades podem estar indisponíveis.','Está novamente online.','PDF automáticos','Ativado','Desativado','À espera de um envio','Voltar','Abrir','Formulário','Campo','Resposta','Ficheiro','Assinatura','E-mail','Imagens','Detalhes','Envios recentes','PDF recentes','Ações rápidas','Está tudo pronto','Ocultar lista concluída','Mostrar lista','Atualizar plano','Selecionar','Configurar','Eliminar','Duplicar',
  ],
  it: [
    'Forms PDF','Panoramica','Moduli','Invii','Modelli PDF','Automazioni','Registri automazioni','Impostazioni','Fatturazione','Aiuto',
    'Inizia','Completa questi passaggi per generare PDF dagli invii di Wix Forms.','Avanzamento configurazione','Completato','Azione richiesta','Verifica Wix Forms','Seleziona un modulo','Scegli un modello PDF','Configura contenuto PDF','Genera PDF di prova','Attiva PDF automatici','Configura consegna',
    'Wix Forms necessario','Aggiungi o configura Wix Forms su questo sito, poi aggiorna.','Aggiorna','Nessun modulo trovato','Nessun invio trovato','Nessun modello','Nessun registro automazioni','Nessun PDF',
    'Data invio','Mittente','Stato','Azioni','Visualizza','Genera PDF','Anteprima','Scarica','Salva','Annulla','Crea modello','Nome modello','Lingua','Piano attuale','PDF questo mese','PDF generati','Automazioni attive','Automazioni non riuscite','Riprova','Cerca',
    'Caricamento','Si è verificato un errore','Salvato','PDF generato','Sei offline. Alcune funzioni potrebbero non essere disponibili.','Sei di nuovo online.','PDF automatici','Attivato','Disattivato','In attesa di un invio','Indietro','Apri','Modulo','Campo','Risposta','File','Firma','Email','Immagini','Dettagli','Invii recenti','PDF recenti','Azioni rapide','È tutto pronto','Nascondi elenco completato','Mostra elenco','Aggiorna piano','Seleziona','Configura','Elimina','Duplica',
  ],
  nl: [
    'Forms PDF','Overzicht','Formulieren','Inzendingen','PDF-sjablonen','Automatiseringen','Automatiseringslogboeken','Instellingen','Facturering','Help',
    'Aan de slag','Voltooi deze stappen om PDF’s van Wix Forms-inzendingen te maken.','Voortgang instelling','Voltooid','Actie vereist','Wix Forms controleren','Formulier selecteren','PDF-sjabloon kiezen','PDF-inhoud instellen','Test-PDF maken','Automatische PDF’s inschakelen','Bezorging instellen',
    'Wix Forms vereist','Voeg Wix Forms toe aan deze site of configureer het en vernieuw.','Vernieuwen','Geen formulieren gevonden','Geen inzendingen gevonden','Nog geen sjablonen','Geen automatiseringslogboeken','Nog geen PDF’s',
    'Inzenddatum','Afzender','Status','Acties','Bekijken','PDF maken','Voorbeeld','Downloaden','Opslaan','Annuleren','Sjabloon maken','Sjabloonnaam','Taal','Huidig abonnement','PDF’s deze maand','Gemaakte PDF’s','Actieve automatiseringen','Mislukte automatiseringen','Opnieuw proberen','Zoeken',
    'Laden','Er is iets misgegaan','Opgeslagen','PDF gemaakt','Je bent offline. Sommige functies zijn mogelijk niet beschikbaar.','Je bent weer online.','Automatische PDF’s','Ingeschakeld','Uitgeschakeld','Wachten op een inzending','Terug','Openen','Formulier','Veld','Antwoord','Bestand','Handtekening','E-mail','Afbeeldingen','Details','Recente inzendingen','Recente PDF’s','Snelle acties','Alles is klaar','Voltooide lijst verbergen','Lijst tonen','Upgraden','Selecteren','Instellen','Verwijderen','Dupliceren',
  ],
  pl: [
    'Forms PDF','Przegląd','Formularze','Zgłoszenia','Szablony PDF','Automatyzacje','Dzienniki automatyzacji','Ustawienia','Rozliczenia','Pomoc',
    'Rozpocznij','Wykonaj te kroki, aby tworzyć PDF ze zgłoszeń Wix Forms.','Postęp konfiguracji','Ukończono','Wymagane działanie','Sprawdź Wix Forms','Wybierz formularz','Wybierz szablon PDF','Skonfiguruj treść PDF','Utwórz testowy PDF','Włącz automatyczne PDF','Skonfiguruj dostarczanie',
    'Wymagany Wix Forms','Dodaj lub skonfiguruj Wix Forms w tej witrynie, a następnie odśwież.','Odśwież','Nie znaleziono formularzy','Nie znaleziono zgłoszeń','Brak szablonów','Brak dzienników automatyzacji','Brak PDF',
    'Data zgłoszenia','Nadawca','Status','Działania','Zobacz','Utwórz PDF','Podgląd','Pobierz','Zapisz','Anuluj','Utwórz szablon','Nazwa szablonu','Język','Bieżący plan','PDF w tym miesiącu','Utworzone PDF','Aktywne automatyzacje','Nieudane automatyzacje','Ponów','Szukaj',
    'Ładowanie','Coś poszło nie tak','Zapisano','Utworzono PDF','Jesteś offline. Niektóre funkcje mogą być niedostępne.','Połączenie przywrócone.','Automatyczne PDF','Włączone','Wyłączone','Oczekiwanie na zgłoszenie','Wróć','Otwórz','Formularz','Pole','Odpowiedź','Plik','Podpis','E-mail','Obrazy','Szczegóły','Ostatnie zgłoszenia','Ostatnie PDF','Szybkie działania','Wszystko gotowe','Ukryj ukończoną listę','Pokaż listę','Zmień plan','Wybierz','Skonfiguruj','Usuń','Duplikuj',
  ],
  sv: [
    'Forms PDF','Översikt','Formulär','Insändningar','PDF-mallar','Automatiseringar','Automatiseringsloggar','Inställningar','Fakturering','Hjälp',
    'Kom igång','Slutför stegen för att skapa PDF-filer från Wix Forms-insändningar.','Installationsförlopp','Klart','Åtgärd krävs','Kontrollera Wix Forms','Välj formulär','Välj PDF-mall','Konfigurera PDF-innehåll','Skapa test-PDF','Aktivera automatiska PDF-filer','Konfigurera leverans',
    'Wix Forms krävs','Lägg till eller konfigurera Wix Forms på webbplatsen och uppdatera.','Uppdatera','Inga formulär hittades','Inga insändningar hittades','Inga mallar ännu','Inga automatiseringsloggar','Inga PDF-filer ännu',
    'Insändningsdatum','Avsändare','Status','Åtgärder','Visa','Skapa PDF','Förhandsgranska','Ladda ner','Spara','Avbryt','Skapa mall','Mallnamn','Språk','Nuvarande plan','PDF-filer denna månad','Skapade PDF-filer','Aktiva automatiseringar','Misslyckade automatiseringar','Försök igen','Sök',
    'Laddar','Något gick fel','Sparat','PDF skapad','Du är offline. Vissa funktioner kanske inte fungerar.','Du är online igen.','Automatiska PDF-filer','Aktiverad','Inaktiverad','Väntar på en insändning','Tillbaka','Öppna','Formulär','Fält','Svar','Fil','Signatur','E-post','Bilder','Detaljer','Senaste insändningar','Senaste PDF-filer','Snabbåtgärder','Allt är klart','Dölj slutförd lista','Visa lista','Uppgradera','Välj','Konfigurera','Ta bort','Duplicera',
  ],
  da: [
    'Forms PDF','Oversigt','Formularer','Indsendelser','PDF-skabeloner','Automatiseringer','Automatiseringslogge','Indstillinger','Fakturering','Hjælp',
    'Kom i gang','Fuldfør disse trin for at oprette PDF’er fra Wix Forms-indsendelser.','Opsætningsstatus','Fuldført','Handling påkrævet','Kontrollér Wix Forms','Vælg en formular','Vælg PDF-skabelon','Konfigurer PDF-indhold','Opret test-PDF','Aktivér automatiske PDF’er','Konfigurer levering',
    'Wix Forms påkrævet','Tilføj eller konfigurer Wix Forms på dette websted, og opdater.','Opdater','Ingen formularer fundet','Ingen indsendelser fundet','Ingen skabeloner endnu','Ingen automatiseringslogge','Ingen PDF’er endnu',
    'Indsendelsesdato','Afsender','Status','Handlinger','Vis','Opret PDF','Forhåndsvis','Download','Gem','Annuller','Opret skabelon','Skabelonnavn','Sprog','Nuværende plan','PDF’er denne måned','Oprettede PDF’er','Aktive automatiseringer','Mislykkede automatiseringer','Prøv igen','Søg',
    'Indlæser','Noget gik galt','Gemt','PDF oprettet','Du er offline. Nogle funktioner er muligvis ikke tilgængelige.','Du er online igen.','Automatiske PDF’er','Aktiveret','Deaktiveret','Venter på en indsendelse','Tilbage','Åbn','Formular','Felt','Svar','Fil','Underskrift','E-mail','Billeder','Detaljer','Seneste indsendelser','Seneste PDF’er','Hurtige handlinger','Du er klar','Skjul fuldført liste','Vis liste','Opgrader','Vælg','Konfigurer','Slet','Dupliker',
  ],
  no: [
    'Forms PDF','Oversikt','Skjemaer','Innsendinger','PDF-maler','Automatiseringer','Automatiseringslogger','Innstillinger','Fakturering','Hjelp',
    'Kom i gang','Fullfør disse trinnene for å lage PDF-er fra Wix Forms-innsendinger.','Oppsettsfremdrift','Fullført','Handling kreves','Kontroller Wix Forms','Velg skjema','Velg PDF-mal','Konfigurer PDF-innhold','Lag test-PDF','Aktiver automatiske PDF-er','Konfigurer levering',
    'Wix Forms kreves','Legg til eller konfigurer Wix Forms på nettstedet og oppdater.','Oppdater','Ingen skjemaer funnet','Ingen innsendinger funnet','Ingen maler ennå','Ingen automatiseringslogger','Ingen PDF-er ennå',
    'Innsendingsdato','Avsender','Status','Handlinger','Vis','Lag PDF','Forhåndsvis','Last ned','Lagre','Avbryt','Lag mal','Malnavn','Språk','Gjeldende plan','PDF-er denne måneden','Genererte PDF-er','Aktive automatiseringer','Mislykkede automatiseringer','Prøv igjen','Søk',
    'Laster','Noe gikk galt','Lagret','PDF generert','Du er frakoblet. Noen funksjoner er kanskje utilgjengelige.','Du er på nett igjen.','Automatiske PDF-er','Aktivert','Deaktivert','Venter på en innsending','Tilbake','Åpne','Skjema','Felt','Svar','Fil','Signatur','E-post','Bilder','Detaljer','Nylige innsendinger','Nylige PDF-er','Hurtighandlinger','Du er klar','Skjul fullført liste','Vis liste','Oppgrader','Velg','Konfigurer','Slett','Dupliser',
  ],
  fi: [
    'Forms PDF','Yleiskatsaus','Lomakkeet','Lähetykset','PDF-mallit','Automaatiot','Automaatiolokit','Asetukset','Laskutus','Ohje',
    'Aloita','Suorita nämä vaiheet, jotta voit luoda PDF:iä Wix Forms -lähetyksistä.','Määrityksen edistyminen','Valmis','Toiminto vaaditaan','Tarkista Wix Forms','Valitse lomake','Valitse PDF-malli','Määritä PDF-sisältö','Luo testi-PDF','Ota automaattiset PDF:t käyttöön','Määritä toimitus',
    'Wix Forms vaaditaan','Lisää tai määritä Wix Forms sivustolle ja päivitä näkymä.','Päivitä','Lomakkeita ei löytynyt','Lähetyksiä ei löytynyt','Ei vielä malleja','Ei automaatiolokeja','Ei vielä PDF:iä',
    'Lähetyspäivä','Lähettäjä','Tila','Toiminnot','Näytä','Luo PDF','Esikatselu','Lataa','Tallenna','Peruuta','Luo malli','Mallin nimi','Kieli','Nykyinen tilaus','PDF:t tässä kuussa','Luodut PDF:t','Aktiiviset automaatiot','Epäonnistuneet automaatiot','Yritä uudelleen','Hae',
    'Ladataan','Jokin meni pieleen','Tallennettu','PDF luotu','Olet offline-tilassa. Jotkin toiminnot eivät ehkä ole käytettävissä.','Olet taas verkossa.','Automaattiset PDF:t','Käytössä','Pois käytöstä','Odotetaan lähetystä','Takaisin','Avaa','Lomake','Kenttä','Vastaus','Tiedosto','Allekirjoitus','Sähköposti','Kuvat','Tiedot','Viimeisimmät lähetykset','Viimeisimmät PDF:t','Pikatoiminnot','Kaikki on valmista','Piilota valmis luettelo','Näytä luettelo','Päivitä tilaus','Valitse','Määritä','Poista','Kopioi',
  ],
  ja: [
    'Forms PDF','概要','フォーム','送信データ','PDFテンプレート','自動化','自動化ログ','設定','請求','ヘルプ',
    '始める','Wix Formsの送信データからPDFを生成するには、次の手順を完了してください。','設定の進捗','完了','対応が必要','Wix Formsを確認','フォームを選択','PDFテンプレートを選択','PDF内容を設定','テストPDFを生成','自動PDFを有効化','配信を設定',
    'Wix Formsが必要です','このサイトにWix Formsを追加または設定し、更新してください。','更新','フォームが見つかりません','送信データがありません','テンプレートがありません','自動化ログがありません','PDFがありません',
    '送信日','送信者','状態','操作','表示','PDFを生成','プレビュー','ダウンロード','保存','キャンセル','テンプレートを作成','テンプレート名','言語','現在のプラン','今月のPDF','生成されたPDF','有効な自動化','失敗した自動化','再試行','検索',
    '読み込み中','エラーが発生しました','保存しました','PDFを生成しました','オフラインです。一部の機能を利用できない場合があります。','オンラインに戻りました。','自動PDF','有効','無効','送信を待っています','戻る','開く','フォーム','項目','回答','ファイル','署名','メール','画像','詳細','最近の送信','最近のPDF','クイック操作','準備完了です','完了したリストを隠す','リストを表示','アップグレード','選択','設定','削除','複製',
  ],
  ko: [
    'Forms PDF','개요','양식','제출 내역','PDF 템플릿','자동화','자동화 로그','설정','결제','도움말',
    '시작하기','Wix Forms 제출 내역에서 PDF를 생성하려면 다음 단계를 완료하세요.','설정 진행률','완료','조치 필요','Wix Forms 확인','양식 선택','PDF 템플릿 선택','PDF 내용 설정','테스트 PDF 생성','자동 PDF 활성화','전달 설정',
    'Wix Forms 필요','이 사이트에 Wix Forms를 추가하거나 설정한 뒤 새로고침하세요.','새로고침','양식이 없습니다','제출 내역이 없습니다','템플릿이 없습니다','자동화 로그가 없습니다','PDF가 없습니다',
    '제출 날짜','제출자','상태','작업','보기','PDF 생성','미리보기','다운로드','저장','취소','템플릿 만들기','템플릿 이름','언어','현재 요금제','이번 달 PDF','생성된 PDF','활성 자동화','실패한 자동화','다시 시도','검색',
    '불러오는 중','문제가 발생했습니다','저장됨','PDF 생성됨','오프라인 상태입니다. 일부 기능을 사용할 수 없습니다.','다시 온라인 상태입니다.','자동 PDF','활성화됨','비활성화됨','제출을 기다리는 중','뒤로','열기','양식','필드','답변','파일','서명','이메일','이미지','상세 정보','최근 제출','최근 PDF','빠른 작업','준비가 완료되었습니다','완료된 목록 숨기기','목록 표시','업그레이드','선택','설정','삭제','복제',
  ],
  'zh-CN': [
    'Forms PDF','概览','表单','提交记录','PDF 模板','自动化','自动化日志','设置','账单','帮助',
    '开始使用','完成以下步骤，即可从 Wix Forms 提交记录生成 PDF。','设置进度','已完成','需要操作','验证 Wix Forms','选择表单','选择 PDF 模板','配置 PDF 内容','生成测试 PDF','启用自动 PDF','配置交付方式',
    '需要 Wix Forms','请在此网站添加或配置 Wix Forms，然后刷新。','刷新','未找到表单','未找到提交记录','暂无模板','暂无自动化日志','暂无 PDF',
    '提交日期','提交者','状态','操作','查看','生成 PDF','预览','下载','保存','取消','创建模板','模板名称','语言','当前套餐','本月 PDF','已生成 PDF','运行中的自动化','失败的自动化','重试','搜索',
    '正在加载','发生错误','已保存','已生成 PDF','您已离线。部分功能可能不可用。','您已恢复在线。','自动 PDF','已启用','已禁用','等待提交记录','返回','打开','表单','字段','答案','文件','签名','电子邮件','图片','详情','最近提交记录','最近 PDF','快捷操作','准备就绪','隐藏已完成清单','显示清单','升级','选择','配置','删除','复制',
  ],
  'zh-TW': [
    'Forms PDF','總覽','表單','提交紀錄','PDF 範本','自動化','自動化紀錄','設定','帳單','說明',
    '開始使用','完成以下步驟，即可從 Wix Forms 提交紀錄產生 PDF。','設定進度','已完成','需要操作','驗證 Wix Forms','選擇表單','選擇 PDF 範本','設定 PDF 內容','產生測試 PDF','啟用自動 PDF','設定交付方式',
    '需要 Wix Forms','請在此網站新增或設定 Wix Forms，然後重新整理。','重新整理','找不到表單','找不到提交紀錄','尚無範本','尚無自動化紀錄','尚無 PDF',
    '提交日期','提交者','狀態','操作','檢視','產生 PDF','預覽','下載','儲存','取消','建立範本','範本名稱','語言','目前方案','本月 PDF','已產生 PDF','啟用中的自動化','失敗的自動化','重試','搜尋',
    '載入中','發生錯誤','已儲存','已產生 PDF','目前離線，部分功能可能無法使用。','已恢復連線。','自動 PDF','已啟用','已停用','等待提交紀錄','返回','開啟','表單','欄位','答案','檔案','簽名','電子郵件','圖片','詳細資料','最近提交紀錄','最近 PDF','快速操作','準備就緒','隱藏已完成清單','顯示清單','升級','選擇','設定','刪除','複製',
  ],
  ar: [
    'Forms PDF','نظرة عامة','النماذج','الإرسالات','قوالب PDF','الأتمتة','سجلات الأتمتة','الإعدادات','الفوترة','المساعدة',
    'ابدأ','أكمل هذه الخطوات لإنشاء ملفات PDF من إرسالات Wix Forms.','تقدم الإعداد','مكتمل','إجراء مطلوب','التحقق من Wix Forms','اختيار نموذج','اختيار قالب PDF','إعداد محتوى PDF','إنشاء PDF تجريبي','تفعيل ملفات PDF التلقائية','إعداد التسليم',
    'مطلوب Wix Forms','أضف Wix Forms إلى هذا الموقع أو قم بإعداده ثم حدّث الصفحة.','تحديث','لم يتم العثور على نماذج','لم يتم العثور على إرسالات','لا توجد قوالب بعد','لا توجد سجلات أتمتة','لا توجد ملفات PDF بعد',
    'تاريخ الإرسال','المرسل','الحالة','الإجراءات','عرض','إنشاء PDF','معاينة','تنزيل','حفظ','إلغاء','إنشاء قالب','اسم القالب','اللغة','الخطة الحالية','ملفات PDF هذا الشهر','ملفات PDF المنشأة','الأتمتة النشطة','الأتمتة الفاشلة','إعادة المحاولة','بحث',
    'جار التحميل','حدث خطأ','تم الحفظ','تم إنشاء PDF','أنت غير متصل. قد لا تتوفر بعض الميزات.','عدت إلى الاتصال.','ملفات PDF التلقائية','مفعّل','معطّل','بانتظار إرسال','رجوع','فتح','نموذج','حقل','إجابة','ملف','توقيع','بريد إلكتروني','صور','تفاصيل','الإرسالات الأخيرة','ملفات PDF الأخيرة','إجراءات سريعة','أنت جاهز','إخفاء القائمة المكتملة','إظهار القائمة','ترقية','اختيار','إعداد','حذف','نسخ',
  ],
  he: [
    'Forms PDF','סקירה כללית','טפסים','הגשות','תבניות PDF','אוטומציות','יומני אוטומציה','הגדרות','חיוב','עזרה',
    'תחילת העבודה','השלימו את השלבים ליצירת PDF מהגשות של Wix Forms.','התקדמות ההגדרה','הושלם','נדרשת פעולה','בדיקת Wix Forms','בחירת טופס','בחירת תבנית PDF','הגדרת תוכן PDF','יצירת PDF לבדיקה','הפעלת PDF אוטומטי','הגדרת משלוח',
    'נדרש Wix Forms','הוסיפו או הגדירו Wix Forms באתר הזה ואז רעננו.','רענון','לא נמצאו טפסים','לא נמצאו הגשות','אין עדיין תבניות','אין יומני אוטומציה','אין עדיין קובצי PDF',
    'תאריך הגשה','מגיש','סטטוס','פעולות','הצגה','יצירת PDF','תצוגה מקדימה','הורדה','שמירה','ביטול','יצירת תבנית','שם התבנית','שפה','מסלול נוכחי','קובצי PDF החודש','קובצי PDF שנוצרו','אוטומציות פעילות','אוטומציות שנכשלו','ניסיון חוזר','חיפוש',
    'טוען','משהו השתבש','נשמר','PDF נוצר','אין חיבור לאינטרנט. ייתכן שחלק מהתכונות לא יהיו זמינות.','החיבור חזר.','PDF אוטומטי','מופעל','מושבת','ממתין להגשה','חזרה','פתיחה','טופס','שדה','תשובה','קובץ','חתימה','אימייל','תמונות','פרטים','הגשות אחרונות','קובצי PDF אחרונים','פעולות מהירות','הכול מוכן','הסתרת הרשימה שהושלמה','הצגת הרשימה','שדרוג','בחירה','הגדרה','מחיקה','שכפול',
  ],
  tr: [
    'Forms PDF','Genel bakış','Formlar','Gönderimler','PDF şablonları','Otomasyonlar','Otomasyon kayıtları','Ayarlar','Faturalandırma','Yardım',
    'Başlayın','Wix Forms gönderimlerinden PDF oluşturmak için bu adımları tamamlayın.','Kurulum ilerlemesi','Tamamlandı','İşlem gerekli','Wix Forms’u doğrula','Form seç','PDF şablonu seç','PDF içeriğini yapılandır','Test PDF’i oluştur','Otomatik PDF’leri etkinleştir','Teslimatı yapılandır',
    'Wix Forms gerekli','Bu siteye Wix Forms ekleyin veya yapılandırın, ardından yenileyin.','Yenile','Form bulunamadı','Gönderim bulunamadı','Henüz şablon yok','Otomasyon kaydı yok','Henüz PDF yok',
    'Gönderim tarihi','Gönderen','Durum','İşlemler','Görüntüle','PDF oluştur','Önizleme','İndir','Kaydet','İptal','Şablon oluştur','Şablon adı','Dil','Geçerli plan','Bu ayki PDF’ler','Oluşturulan PDF’ler','Etkin otomasyonlar','Başarısız otomasyonlar','Yeniden dene','Ara',
    'Yükleniyor','Bir hata oluştu','Kaydedildi','PDF oluşturuldu','Çevrimdışısınız. Bazı özellikler kullanılamayabilir.','Yeniden çevrimiçisiniz.','Otomatik PDF’ler','Etkin','Devre dışı','Gönderim bekleniyor','Geri','Aç','Form','Alan','Yanıt','Dosya','İmza','E-posta','Görseller','Ayrıntılar','Son gönderimler','Son PDF’ler','Hızlı işlemler','Hazırsınız','Tamamlanan listeyi gizle','Listeyi göster','Yükselt','Seç','Yapılandır','Sil','Çoğalt',
  ],
  id: [
    'Forms PDF','Ringkasan','Formulir','Kiriman','Templat PDF','Otomatisasi','Log otomatisasi','Pengaturan','Penagihan','Bantuan',
    'Mulai','Selesaikan langkah ini untuk membuat PDF dari kiriman Wix Forms.','Progres penyiapan','Selesai','Perlu tindakan','Periksa Wix Forms','Pilih formulir','Pilih templat PDF','Atur isi PDF','Buat PDF uji','Aktifkan PDF otomatis','Atur pengiriman',
    'Wix Forms diperlukan','Tambahkan atau atur Wix Forms di situs ini, lalu segarkan.','Segarkan','Formulir tidak ditemukan','Kiriman tidak ditemukan','Belum ada templat','Tidak ada log otomatisasi','Belum ada PDF',
    'Tanggal kiriman','Pengirim','Status','Tindakan','Lihat','Buat PDF','Pratinjau','Unduh','Simpan','Batal','Buat templat','Nama templat','Bahasa','Paket saat ini','PDF bulan ini','PDF dibuat','Otomatisasi aktif','Otomatisasi gagal','Coba lagi','Cari',
    'Memuat','Terjadi kesalahan','Tersimpan','PDF dibuat','Anda sedang offline. Beberapa fitur mungkin tidak tersedia.','Anda kembali online.','PDF otomatis','Aktif','Nonaktif','Menunggu kiriman','Kembali','Buka','Formulir','Bidang','Jawaban','File','Tanda tangan','Email','Gambar','Detail','Kiriman terbaru','PDF terbaru','Tindakan cepat','Anda siap','Sembunyikan daftar selesai','Tampilkan daftar','Tingkatkan','Pilih','Atur','Hapus','Duplikat',
  ],
};

export function translate(locale: Locale, key: MessageKey): string {
  if (key in universalMessages) return universalMessages[key as keyof typeof universalMessages];
  const extraIndex = extraKeys.indexOf(key as ExtraKey);
  const message = extraIndex >= 0 ? extraRows[locale]?.[extraIndex] : rows[locale][keys.indexOf(key as typeof keys[number])];
  if (!message) throw new Error(`Missing translation: ${locale}.${key}`);
  return message;
}

export function validateCatalogs(): string[] {
  return Object.entries(rows).flatMap(([locale, messages]) => {
    const errors = messages.length === keys.length ? [] : [`${locale}: ${messages.length}/${keys.length}`];
    messages.forEach((message, index) => { if (!message.trim()) errors.push(`${locale}: ${keys[index] ?? index}`); });
    const extras = extraRows[locale];
    if (!extras || extras.length !== extraKeys.length) errors.push(`${locale}: extra ${extras?.length ?? 0}/${extraKeys.length}`);
    extras?.forEach((message, index) => { if (!message.trim()) errors.push(`${locale}: ${extraKeys[index] ?? index}`); });
    return errors;
  });
}
