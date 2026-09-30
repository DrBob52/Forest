import SwiftUI
import UIKit
import WebKit

/// Hosts the forest, a self-contained WebGL page bundled in the app's `Web` folder.
/// The page is built from the repository's index.html by `npm run build:ios`.
struct ForestView: UIViewRepresentable {
    func makeCoordinator() -> Coordinator {
        Coordinator()
    }

    func makeUIView(context: Context) -> WKWebView {
        let contentController = WKUserContentController()
        // Lets the page know it runs inside the app (touch styling, haptics).
        contentController.addUserScript(WKUserScript(
            source: "window.UNDERSTORY_NATIVE = 'ios';",
            injectionTime: .atDocumentStart,
            forMainFrameOnly: true
        ))
        contentController.add(context.coordinator, name: "haptics")

        let configuration = WKWebViewConfiguration()
        configuration.userContentController = contentController

        let background = UIColor(named: "LaunchBackground") ?? .black
        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.isOpaque = false
        webView.backgroundColor = background
        webView.scrollView.backgroundColor = background
        webView.scrollView.isScrollEnabled = false
        webView.scrollView.bounces = false
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.allowsLinkPreview = false
        webView.navigationDelegate = context.coordinator
        #if DEBUG
        if #available(iOS 16.4, *) {
            // Allows Safari's Web Inspector to attach to debug builds.
            webView.isInspectable = true
        }
        #endif

        context.coordinator.webView = webView
        context.coordinator.loadForest()
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {}

    @MainActor
    final class Coordinator: NSObject, WKNavigationDelegate, WKScriptMessageHandler {
        weak var webView: WKWebView?
        private lazy var lightImpact = UIImpactFeedbackGenerator(style: .light)
        private lazy var mediumImpact = UIImpactFeedbackGenerator(style: .medium)

        func loadForest() {
            guard let webView,
                  let page = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "Web") else {
                assertionFailure("Web/index.html is missing from the app bundle. Run `npm run build:ios`.")
                return
            }
            webView.loadFileURL(page, allowingReadAccessTo: page.deletingLastPathComponent())
        }

        // iOS can end the web content process under memory pressure; reload rather than show a blank screen.
        func webViewWebContentProcessDidTerminate(_ webView: WKWebView) {
            loadForest()
        }

        func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
            switch message.body as? String {
            case "select":
                lightImpact.impactOccurred()
            case "regrow":
                mediumImpact.impactOccurred()
            default:
                break
            }
        }
    }
}
