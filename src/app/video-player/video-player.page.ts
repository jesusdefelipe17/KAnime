import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.page.html',
  styleUrls: ['./video-player.page.scss'],
})
export class VideoPlayerPage implements OnInit {

  videoUrl: SafeResourceUrl;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    const url = this.navParams.get('videoUrl');
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
