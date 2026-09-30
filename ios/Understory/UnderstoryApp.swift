import SwiftUI

@main
struct UnderstoryApp: App {
    var body: some Scene {
        WindowGroup {
            ForestView()
                .ignoresSafeArea()
                .background(Color("LaunchBackground"))
                .statusBarHidden(true)
                .persistentSystemOverlays(.hidden)
                .preferredColorScheme(.dark)
        }
    }
}
