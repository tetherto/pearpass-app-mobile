"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.withSplashScreenIOS = exports.SPLASH_STORYBOARD_XML = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
async function copyDirectory(src, dest) {
    await fs.promises.mkdir(dest, { recursive: true });
    const entries = await fs.promises.readdir(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            await copyDirectory(srcPath, destPath);
        }
        else {
            await fs.promises.copyFile(srcPath, destPath);
        }
    }
}
// The storyboard XML content - this will be copied via post_integrate hook in Podfile
// because Expo's base mod corrupts XML when we use withMod
exports.SPLASH_STORYBOARD_XML = `<?xml version="1.0" encoding="UTF-8"?>
<document type="com.apple.InterfaceBuilder3.CocoaTouch.Storyboard.XIB" version="3.0" toolsVersion="23727" targetRuntime="iOS.CocoaTouch" propertyAccessControl="none" useAutolayout="YES" launchScreen="YES" useTraitCollections="YES" useSafeAreas="YES" colorMatched="YES" initialViewController="EXPO-VIEWCONTROLLER-1">
    <device id="retina6_12" orientation="portrait" appearance="light"/>
    <dependencies>
        <deployment identifier="iOS"/>
        <plugIn identifier="com.apple.InterfaceBuilder.IBCocoaTouchPlugin" version="23721"/>
        <capability name="Named colors" minToolsVersion="9.0"/>
        <capability name="Safe area layout guides" minToolsVersion="9.0"/>
        <capability name="documents saved in the Xcode 8 format" minToolsVersion="8.0"/>
    </dependencies>
    <scenes>
        <!--View Controller-->
        <scene sceneID="EXPO-SCENE-1">
            <objects>
                <viewController storyboardIdentifier="SplashScreenViewController" id="EXPO-VIEWCONTROLLER-1" sceneMemberID="viewController">
                    <view key="view" userInteractionEnabled="NO" contentMode="scaleToFill" insetsLayoutMarginsFromSafeArea="NO" id="EXPO-ContainerView" userLabel="ContainerView">
                        <rect key="frame" x="0.0" y="0.0" width="393" height="852"/>
                        <autoresizingMask key="autoresizingMask"/>
                        <subviews>
                            <imageView clipsSubviews="YES" userInteractionEnabled="NO" contentMode="scaleAspectFill" fixedFrame="YES" image="SplashImage" translatesAutoresizingMaskIntoConstraints="NO" id="z1R-Jr-8G1">
                                <rect key="frame" x="0.0" y="0.0" width="393" height="852"/>
                                <autoresizingMask key="autoresizingMask" widthSizable="YES" heightSizable="YES"/>
                            </imageView>
                        </subviews>
                        <viewLayoutGuide key="safeArea" id="Rmq-lb-GrQ"/>
                        <color key="backgroundColor" name="SplashScreenBackground"/>
                    </view>
                </viewController>
                <placeholder placeholderIdentifier="IBFirstResponder" id="EXPO-PLACEHOLDER-1" userLabel="First Responder" sceneMemberID="firstResponder"/>
            </objects>
            <point key="canvasLocation" x="-0.76335877862595414" y="0.0"/>
        </scene>
    </scenes>
    <resources>
        <image name="SplashImage" width="430" height="932"/>
        <namedColor name="SplashScreenBackground">
            <color red="0.13725490868091583" green="0.13725490868091583" blue="0.13725490868091583" alpha="1" colorSpace="custom" customColorSpace="sRGB"/>
        </namedColor>
    </resources>
</document>`;
// Write storyboard template to a temp location for post_integrate hook to use
const withSplashScreenTemplate = (config) => {
    return (0, config_plugins_1.withDangerousMod)(config, ['ios', async (cfg) => {
            const iosDir = cfg.modRequest.platformProjectRoot;
            const templatePath = path.join(iosDir, '.splash-storyboard-template.xml');
            await fs.promises.writeFile(templatePath, exports.SPLASH_STORYBOARD_XML);
            return cfg;
        }]);
};
// Copy splash screen assets (images, colorsets)
const withSplashScreenAssets = (config) => {
    return (0, config_plugins_1.withDangerousMod)(config, ['ios', async (cfg) => {
            const templateDir = path.join(__dirname, '../../templates/ios');
            const iosDir = cfg.modRequest.platformProjectRoot;
            const projectName = cfg.modRequest.projectName || cfg.name || 'PearPass';
            const projectDir = path.join(iosDir, projectName);
            const imagesDir = path.join(projectDir, 'Images.xcassets');
            // Copy SplashImage.imageset
            const splashImageSrc = path.join(templateDir, 'SplashImage.imageset');
            const splashImageDest = path.join(imagesDir, 'SplashImage.imageset');
            if (fs.existsSync(splashImageSrc)) {
                await copyDirectory(splashImageSrc, splashImageDest);
            }
            // Copy SplashScreenLogo.imageset
            const splashLogoSrc = path.join(templateDir, 'SplashScreenLogo.imageset');
            const splashLogoDest = path.join(imagesDir, 'SplashScreenLogo.imageset');
            if (fs.existsSync(splashLogoSrc)) {
                await copyDirectory(splashLogoSrc, splashLogoDest);
            }
            // Copy SplashScreenBackground.colorset
            const splashBgSrc = path.join(templateDir, 'SplashScreenBackground.colorset');
            const splashBgDest = path.join(imagesDir, 'SplashScreenBackground.colorset');
            if (fs.existsSync(splashBgSrc)) {
                await copyDirectory(splashBgSrc, splashBgDest);
            }
            return cfg;
        }]);
};
const withSplashScreenIOS = (config) => {
    // Write storyboard template for post_integrate hook
    config = withSplashScreenTemplate(config);
    // Copy the assets
    config = withSplashScreenAssets(config);
    return config;
};
exports.withSplashScreenIOS = withSplashScreenIOS;
