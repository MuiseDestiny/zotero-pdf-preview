declare interface DirectoryIterator {
  forEach(handler: any): Promise<void>;
  close(): void;
  next: () => any;
}
declare interface DirectoryIteratorConstructable {
  new (path: string): DirectoryIterator; // eslint-disable-line @typescript-eslint/prefer-function-type
}

declare namespace OS {
  namespace File {
    type Entry = {
      isDir: boolean;
      size: number;
      path: string;
      unixMode?: number;
    };
    type FileInfo = {
      isDir: boolean;
      size: number;
      unixMode?: number;
      lastModificationDate: Date;
    };
  }
}
declare const OS: {
  // https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/OSFile.jsm/OS.File_for_the_main_thread
  File: {
    exists: (path: string) => boolean | Promise<boolean>;
    read: (
      path: string | BufferSource,
      options?: { encoding?: string }
    ) =>
      | string
      | Promise<string>
      | Uint8Array
      | Promise<Uint8Array>
      | Promise<BufferSource>;
    move: (from: string, to: string) => void | Promise<void>;
    remove: (
      path: string,
      options?: { ignoreAbsent: boolean }
    ) => Promise<void>;
    writeAtomic: (
      path: string,
      data: Uint8Array | string,
      options?: { tmpPath?: string; encoding?: string }
    ) => void | Promise<void>;
    makeDir: (
      path: string,
      options?: { ignoreExisting?: boolean }
    ) => void | Promise<void>;
    stat: (path: string) => OS.File.FileInfo | Promise<OS.File.FileInfo>;
    copy: (
      src: string,
      tgt: string,
      options?: { noOverwrite?: boolean }
    ) => void;
    removeDir: (
      path: string,
      options?: { ignoreAbsent?: boolean; ignorePermissions?: boolean }
    ) => void;

    DirectoryIterator: DirectoryIteratorConstructable;
  };

  // https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/OSFile.jsm/OS.Path
  Path: {
    join: (...args: string[]) => string;
    dirname: (path: string) => string;
    basename: (path: string) => string;
    normalize: (path: string) => string;
    split: (path: string) => {
      absolute: boolean;
      components: string[];
      winDrive?: string;
    };
    toFileURI: (path: string) => string;
  };
};

declare const NetUtil: { [attr: string]: any };

declare interface ZoteroItem {
  getFilePathAsync(): any;
  id: number;
  isRegularItem: () => boolean;
  isNote: () => boolean;
  getNote: () => string;
  setNote: (string) => void;
  getNoteTitle: () => string;
  isAttachment: () => boolean;
  isAnnotation: () => boolean;
  isPDFAttachment: () => boolean;
  addTag: (name: string, type: number) => boolean;
  removeTag(tag: string): boolean;
  itemTypeID: number;
  libraryID: number;
  parentID: number;
  parentItem: ZoteroItem;
  key: string;
  _version: any;
  getField: (
    name: string,
    unformatted?: boolean,
    includeBaseMapped?: boolean
  ) => any;
  setField: (name: string, value: string | number) => void;
  getCreators: () => {
    firstName?: string;
    lastName: string;
    fieldMode: number;
    creatorTypeID: number;
  }[];
  getCreatorsJSON: () => {
    firstName?: string;
    lastName?: string;
    name?: string;
    creatorType: string;
  }[];
  getNotes: () => ZoteroItem[];
  getCollections: () => number[];
  getAttachments: () => number[];
  getTags: () => { tag: string; type: number }[];
  annotationType?: string;
  annotationComment?: string;
  annotationText?: string;
  annotationPosition: string;
  save: (obj?: any) => Promise<void>;
  saveTx: (obj?: any) => Promise<void>;
  addToCollection(id: number);
}

// https://stackoverflow.com/questions/39040108/import-class-in-definition-file-d-ts
declare const Zotero: {
  [attr: string]: any;
  debug: (args: any) => void;
  Prefs: {
    get: (key: string) => any;
    set: (key: string, value: any) => any;
  };
  Items: {
    get: (
      key: string | number | string[] | number[]
    ) => ZoteroItem | ZoteroItem[];
  };
  Reader: Reader;
  Notes: Notes;
  PDFPreview: import("../src/addon");
};

declare const ZoteroPane: {
  [attr: string]: any;
  canEdit: () => boolean;
  displayCannotEditLibraryMessage: () => void;
  getSelectedCollection: (arg: boolean) => ZoteroCollection;
  getSelectedItems: () => Array<ZoteroItem>;
};

declare const ZoteroPane_Local: {
  getSelectedCollection: () => ZoteroCollection;
  newNote: (popup?, parentKey?, text?, citeURI?) => Promise<number>;
};

declare const Zotero_File_Interface: {
  exportItemsToClipboard: (items: ZoteroItem[], translatorID: string) => void;
};

declare class ZoteroCollection {
  getName: () => string;
  getChildItems: (arg1: boolean, arg2: boolean) => Array<ZoteroItem>;
}

declare class Zotero_File_Exporter {
  items: ZoteroItem[];
  save = async () => {};
}

declare const Components: any;
declare const Services: any;

declare class Reader {
  [attr: string]: any;
  _readers: Array<ReaderObj>;
  getByTabID: (tabID: string) => ReaderObj;
}

declare class ReaderObj {
  [attr: string]: any;
  itemID: number;
  _iframeWindow: XULWindow;
  _initPromise: Promise;
}

declare class EditorInstance {
  [attr: string]: any;
  _iframeWindow: XULWindow;
  _item: ZoteroItem;
  _initPromise: Promise;
}

declare class Notes {
  _editorInstances: EditorInstance[];
  registerEditorInstance: (instance: EditorInstance) => void;
  // custom
  _registerEditorInstance?: (instance: EditorInstance) => void;
}

declare const ZoteroContextPane: {
  [attr: string]: any;
  getActiveEditor: () => EditorInstance;
};

declare class Annotation {
  text: string;
}

declare const Zotero_Tabs: {
  _getTab(tabId: string);
  jump(workspaceTabId: Number);
  close(tabId: string);
  select(tabId: string);
  add(arg0: {
    type: string;
    title: any;
    index: any;
    data: object;
    select: boolean;
    onClose: Function;
  });
  _tabs: Array<any>;
  selectedID: string;
};

declare const openWindowByType: (
  uri: string,
  type: string,
  features: string
) => Window;

declare class Shortcut {
  id: number;
  func: any;
  modifiers: string;
  key: string;
  keycode?: string;
}
