export const extraKeys = [
  'title', 'subtitle', 'footer', 'pageSize', 'imageColumns', 'hideEmpty', 'setDefault',
  'downloadZip', 'confirmDelete', 'starterMinimal', 'selectedItems', 'monthlyLimit',
  'billingUnavailable', 'editTemplate',
] as const;

export type ExtraKey = typeof extraKeys[number];

export const extraRows: Record<string, string[]> = {
  en: ['Title','Subtitle','Footer','Page size','Image columns','Hide empty fields','Set as default','Download ZIP','Delete this template?','Minimal','Selected','Monthly limit','Billing is not configured','Edit template'],
  es: ['Título','Subtítulo','Pie de página','Tamaño de página','Columnas de imágenes','Ocultar campos vacíos','Establecer como predeterminada','Descargar ZIP','¿Eliminar esta plantilla?','Mínima','Seleccionados','Límite mensual','La facturación no está configurada','Editar plantilla'],
  fr: ['Titre','Sous-titre','Pied de page','Format de page','Colonnes d’images','Masquer les champs vides','Définir par défaut','Télécharger le ZIP','Supprimer ce modèle ?','Minimal','Sélectionnés','Limite mensuelle','La facturation n’est pas configurée','Modifier le modèle'],
  de: ['Titel','Untertitel','Fußzeile','Seitengröße','Bildspalten','Leere Felder ausblenden','Als Standard festlegen','ZIP herunterladen','Diese Vorlage löschen?','Minimal','Ausgewählt','Monatliches Limit','Abrechnung ist nicht eingerichtet','Vorlage bearbeiten'],
  pt: ['Título','Subtítulo','Rodapé','Tamanho da página','Colunas de imagens','Ocultar campos vazios','Definir como padrão','Transferir ZIP','Eliminar este modelo?','Mínimo','Selecionados','Limite mensal','A faturação não está configurada','Editar modelo'],
  it: ['Titolo','Sottotitolo','Piè di pagina','Formato pagina','Colonne immagini','Nascondi campi vuoti','Imposta come predefinito','Scarica ZIP','Eliminare questo modello?','Minimale','Selezionati','Limite mensile','La fatturazione non è configurata','Modifica modello'],
  nl: ['Titel','Ondertitel','Voettekst','Paginaformaat','Afbeeldingskolommen','Lege velden verbergen','Als standaard instellen','ZIP downloaden','Dit sjabloon verwijderen?','Minimaal','Geselecteerd','Maandelijkse limiet','Facturering is niet ingesteld','Sjabloon bewerken'],
  pl: ['Tytuł','Podtytuł','Stopka','Rozmiar strony','Kolumny obrazów','Ukryj puste pola','Ustaw jako domyślny','Pobierz ZIP','Usunąć ten szablon?','Minimalny','Wybrane','Limit miesięczny','Rozliczenia nie są skonfigurowane','Edytuj szablon'],
  sv: ['Titel','Undertitel','Sidfot','Sidstorlek','Bildkolumner','Dölj tomma fält','Ange som standard','Ladda ner ZIP','Ta bort mallen?','Minimal','Valda','Månadsgräns','Fakturering är inte konfigurerad','Redigera mall'],
  da: ['Titel','Undertitel','Sidefod','Sidestørrelse','Billedkolonner','Skjul tomme felter','Angiv som standard','Download ZIP','Slet denne skabelon?','Minimal','Valgte','Månedlig grænse','Fakturering er ikke konfigureret','Rediger skabelon'],
  no: ['Tittel','Undertittel','Bunntekst','Sidestørrelse','Bildekolonner','Skjul tomme felt','Angi som standard','Last ned ZIP','Slette denne malen?','Minimal','Valgte','Månedlig grense','Fakturering er ikke konfigurert','Rediger mal'],
  fi: ['Otsikko','Alaotsikko','Alatunniste','Sivukoko','Kuvasarakkeet','Piilota tyhjät kentät','Aseta oletukseksi','Lataa ZIP','Poistetaanko tämä malli?','Yksinkertainen','Valitut','Kuukausiraja','Laskutusta ei ole määritetty','Muokkaa mallia'],
  ja: ['タイトル','サブタイトル','フッター','ページサイズ','画像の列数','空欄を非表示','既定に設定','ZIPをダウンロード','このテンプレートを削除しますか？','シンプル','選択済み','月間上限','請求設定がありません','テンプレートを編集'],
  ko: ['제목','부제목','바닥글','페이지 크기','이미지 열','빈 필드 숨기기','기본값으로 설정','ZIP 다운로드','이 템플릿을 삭제할까요?','기본형','선택됨','월간 한도','결제가 설정되지 않았습니다','템플릿 편집'],
  'zh-CN': ['标题','副标题','页脚','页面大小','图片列数','隐藏空字段','设为默认','下载 ZIP','删除此模板？','简约','已选择','每月限额','尚未配置账单','编辑模板'],
  'zh-TW': ['標題','副標題','頁尾','頁面大小','圖片欄數','隱藏空白欄位','設為預設','下載 ZIP','刪除此範本？','簡約','已選取','每月上限','尚未設定帳務','編輯範本'],
  ar: ['العنوان','العنوان الفرعي','التذييل','حجم الصفحة','أعمدة الصور','إخفاء الحقول الفارغة','تعيين كافتراضي','تنزيل ZIP','حذف هذا القالب؟','بسيط','المحدد','الحد الشهري','الفوترة غير مهيأة','تعديل القالب'],
  he: ['כותרת','כותרת משנה','כותרת תחתונה','גודל עמוד','עמודות תמונה','הסתרת שדות ריקים','הגדרה כברירת מחדל','הורדת ZIP','למחוק את התבנית?','מינימלי','נבחרו','מגבלה חודשית','החיוב אינו מוגדר','עריכת תבנית'],
  tr: ['Başlık','Alt başlık','Alt bilgi','Sayfa boyutu','Görsel sütunları','Boş alanları gizle','Varsayılan yap','ZIP indir','Bu şablon silinsin mi?','Minimal','Seçilen','Aylık sınır','Faturalandırma yapılandırılmadı','Şablonu düzenle'],
  id: ['Judul','Subjudul','Footer','Ukuran halaman','Kolom gambar','Sembunyikan bidang kosong','Jadikan bawaan','Unduh ZIP','Hapus templat ini?','Minimal','Dipilih','Batas bulanan','Penagihan belum dikonfigurasi','Edit templat'],
};
