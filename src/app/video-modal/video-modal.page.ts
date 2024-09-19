import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-video-modal',
  templateUrl: './video-modal.page.html',
  styleUrls: ['./video-modal.page.scss'],
})
export class VideoModalPage implements OnInit {

  videos: any[] = []; // Los videos pasados al modal

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    // Recogemos los videos desde los parámetros del modal
    this.videos = this.navParams.get('videos');
  }

  // Al seleccionar un video, cerramos el modal y devolvemos la URL seleccionada
  selectVideo(videoUrl: string) {
    this.modalCtrl.dismiss({
      videoUrl
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
