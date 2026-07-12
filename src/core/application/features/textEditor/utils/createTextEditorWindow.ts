import { Apps } from "@domain/data/Apps";
import { TranslationKeys } from "@domain/data/Translations";
import Window from "@domain/models/Window";
import CryptoExtensions from "@packages/acore-ts/crypto/CryptoExtensions";

export default function createTextEditorWindow(args: string[]): Window {
  return new Window(
    CryptoExtensions.generateNanoId(),
    Apps.textEditor,
    TranslationKeys.apps_text_editor,
    0,
    false,
    false,
    undefined,
    undefined,
    new Date(),
    args,
  );
}
