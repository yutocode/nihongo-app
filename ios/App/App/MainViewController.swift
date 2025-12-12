// App/MainViewController.swift

import UIKit
import Capacitor

/// Capacitor の WebView を包むメイン画面。
/// 画面の一番下に「黒い帯（広告用コンテナ）」を敷く。
class MainViewController: CAPBridgeViewController {

    /// 底の黒い帯（ここに AdMob バナーが乗る想定）
    private let adBackgroundView = UIView()

    /// 黒帯の高さ制約（セーフエリアに合わせて更新したいので保持）
    private var adHeightConstraint: NSLayoutConstraint?

    /// WebView の bottom 制約（BottomNav + 広告ぶん空ける）
    private var webViewBottomConstraint: NSLayoutConstraint?

    override func viewDidLoad() {
        super.viewDidLoad()

        // 画面全体の背景は「白」に戻す
        view.backgroundColor = .white

        // WebView 周りの見え方を調整
        if let webView = bridge?.webView {
            webView.backgroundColor = .clear
            webView.scrollView.backgroundColor = .clear
            // 引っ張ったときにビヨーンと出るのが気になる場合はコメントアウト外す
            // webView.scrollView.bounces = false
            // webView.scrollView.alwaysBounceVertical = false
        }

        setupAdBackgroundView()
        adjustWebViewConstraints()
    }

    /// セーフエリアが変わったとき（回転・ホームバー高さなど）に呼ばれる
    override func viewSafeAreaInsetsDidChange() {
        super.viewSafeAreaInsetsDidChange()
        updateBottomInset()
    }

    // MARK: - Private

    /// 一番下の黒帯ビューを作る
    private func setupAdBackgroundView() {
        adBackgroundView.translatesAutoresizingMaskIntoConstraints = false
        adBackgroundView.backgroundColor = .black

        view.addSubview(adBackgroundView)

        // 初期値は「広告 56pt + セーフエリア」
        let height = 56 + view.safeAreaInsets.bottom
        adHeightConstraint = adBackgroundView.heightAnchor.constraint(equalToConstant: height)

        NSLayoutConstraint.activate([
            adBackgroundView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            adBackgroundView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            adBackgroundView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            adHeightConstraint!
        ])
    }

    /// WebView の AutoLayout を設定し直して、
    /// 下に「BottomNav(72) + 広告(56) + セーフエリア」ぶんの余白をあける
    private func adjustWebViewConstraints() {
        guard let webView = bridge?.webView else { return }

        webView.translatesAutoresizingMaskIntoConstraints = false

        // 既存制約は一旦オフ（Capacitor が付けたもの）
        NSLayoutConstraint.deactivate(webView.constraints)

        let top = webView.topAnchor.constraint(equalTo: view.topAnchor)
        let leading = webView.leadingAnchor.constraint(equalTo: view.leadingAnchor)
        let trailing = webView.trailingAnchor.constraint(equalTo: view.trailingAnchor)

        let bottomMargin: CGFloat = 72 + 56 + view.safeAreaInsets.bottom
        let bottom = webView.bottomAnchor.constraint(
            equalTo: view.bottomAnchor,
            constant: -bottomMargin
        )

        NSLayoutConstraint.activate([top, leading, trailing, bottom])
        webViewBottomConstraint = bottom
    }

    /// セーフエリアが変わったときに、下の余白を再計算
    private func updateBottomInset() {
        let inset = view.safeAreaInsets.bottom
        let bottomMargin: CGFloat = 72 + 56 + inset

        webViewBottomConstraint?.constant = -bottomMargin
        adHeightConstraint?.constant = 56 + inset

        view.layoutIfNeeded()
    }
}
