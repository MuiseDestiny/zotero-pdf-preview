import { AddonBase, PreviewType } from "./base";

class Annotation {
  type: string;
  position: any;
  color: string;
  pageLabel: string;
  constructor(type, position, color, pageLabel) {
    this.type = type;
    this.position = position;
    this.color = color;
    this.pageLabel = pageLabel;
  }
}
class AddonPreview extends AddonBase {
  item: ZoteroItem;
  lastType: PreviewType;
  _initPromise: any;
  _loadingPromise: any;

  public updatePreviewItem(alwaysUpdate: boolean = false) {
    let items = ZoteroPane.getSelectedItems();
    if (!items.length) {
      return false;
    }
    let item: ZoteroItem;
    for (const _item of items) {
      if (_item.isPDFAttachment()) {
        item = _item;
        break;
      } else if (_item.isRegularItem()) {
        const attachment = (
          Zotero.Items.get(_item.getAttachments()) as ZoteroItem[]
        ).find((att) => att.isPDFAttachment());
        if (attachment) {
          item = attachment;
          break;
        }
      }
    }
    if (!item) {
      return false;
    }
    if (!alwaysUpdate && this.item && item.id === this.item.id) {
      console.log("Preview skipped for same item");
      return false;
    }
    this.item = item;
    return this.item;
  }

  public async getBuffer() {
    console.log(this.item);
    let path: string = await this.item.getFilePathAsync();
    let buf: any = await OS.File.read(path, {});
    return new Uint8Array(buf).buffer;
  }

  public async preview(type: PreviewType, force: boolean = false) {
    if (
      Zotero.Prefs.get("pdfpreview.enable") === false ||
      Zotero.Prefs.get(
        `pdfpreview.${
          type === PreviewType.preview ? "enableTab" : "enableSplit"
        }`
      ) === false
    ) {
      return;
    }
    let item = this.updatePreviewItem(type !== this.lastType);
    console.log(item);
    if (force && !item) {
      item = this.item;
    }

    let containerId = "";
    let iframeId = "";
    const splitType: "before" | "after" = Zotero.Prefs.get(
      "pdfpreview.splitType"
    );
    if (type === PreviewType.info) {
      iframeId = `pdf-preview-info-${splitType}-container`;
      containerId = `pdf-preview-infosplit-${splitType}`;
    } else if (type === PreviewType.preview) {
      iframeId = `pdf-preview-preview-container`;
      containerId = "pdf-preview-tabpanel";
    } else if (type === PreviewType.attachment) {
      iframeId = `pdf-preview-attachment-${splitType}-container`;
      containerId = `pdf-preview-attachment-${splitType}`;
    } else {
      return;
    }

    let previewIframe = document.getElementById(iframeId) as HTMLIFrameElement;
    if (item) {
      if (this._loadingPromise) {
        await this._loadingPromise.promise;
      }
      if (!previewIframe) {
        console.log("init preview iframe");
        this._initPromise = Zotero.Promise.defer();
        previewIframe = window.document.createElement("iframe");
        previewIframe.setAttribute("id", iframeId);
        previewIframe.setAttribute(
          "src",
          "chrome://PDFPreview/content/previewPDF.html"
        );

        const container = document.getElementById(containerId);
        if (!container) {
          return;
        }
        container.appendChild(previewIframe);
      }
      previewIframe.hidden = false;
      const width = previewIframe.parentElement.clientWidth;
      if (!width) {
        return;
      }
      previewIframe.style.width = `${width}px`;
      await this._initPromise.promise;

      if ((item as unknown as ZoteroItem).id !== this.item.id) {
        return;
      }
      console.log("do preview");
      this.lastType = type;
      previewIframe.contentWindow.postMessage(
        {
          type: "renderPreview",
          itemID: this.item.id,
          buffer: await this.getBuffer(),
          width: width - 40,
          annotations: Zotero.Prefs.get("pdfpreview.showAnnotations")
            ? item
                .getAnnotations()
                .map(
                  (i) =>
                    new Annotation(
                      i.annotationType,
                      JSON.parse(i.annotationPosition),
                      i.annotationColor,
                      i.annotationPageLabel
                    )
                )
            : [],
        },
        "*"
      );
      if (Zotero.Prefs.get("pdfpreview.autoPreview")) {
        this._Addon.events.updatePreviewTabSelection();
      }
      previewIframe.hidden = false;
    } else {
      console.log("hide preview");
      if (previewIframe) {
        previewIframe.hidden = true;
      }
    }
  }
}

export default AddonPreview;
