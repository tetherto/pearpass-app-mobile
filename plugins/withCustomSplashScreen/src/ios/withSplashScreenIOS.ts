import { ConfigPlugin, withDangerousMod } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';

async function copyDirectory(src: string, dest: string): Promise<void> {
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

// The storyboard XML content - this will be copied via post_integrate hook in Podfile
// because Expo's base mod corrupts XML when we use withMod
export const SPLASH_STORYBOARD_XML = `<?xml version="1.0" encoding="UTF-8"?>
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
const withSplashScreenTemplate: ConfigPlugin = (config) => {
  return withDangerousMod(config, ['ios', async (cfg) => {
    const iosDir = cfg.modRequest.platformProjectRoot;
    const templatePath = path.join(iosDir, '.splash-storyboard-template.xml');
    await fs.promises.writeFile(templatePath, SPLASH_STORYBOARD_XML);
    return cfg;
  }]);
};

// Copy splash screen assets (images, colorsets)
const withSplashScreenAssets: ConfigPlugin = (config) => {
  return withDangerousMod(config, ['ios', async (cfg) => {
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

export const withSplashScreenIOS: ConfigPlugin = (config) => {
  // Write storyboard template for post_integrate hook
  config = withSplashScreenTemplate(config);
  // Copy the assets
  config = withSplashScreenAssets(config);
  return config;
};
