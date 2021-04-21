import { Component } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ToastController } from '@ionic/angular';
import { Item } from '../models/models';
import { GroceriesService } from '../services/groceries.service';
import { InputDialogService } from '../services/input-dialog.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  title = "Grocery"

  items: Item[] = [];
  errorMessage: string;

  constructor(private toastController: ToastController, private groceryService: GroceriesService, private inputDialogService: InputDialogService, private socialSharing: SocialSharing) {
    groceryService.dataChanged$.subscribe(this.loadItems.bind(this));
  }

  ngOnInit() {
    this.loadItems();
  }

  public loadItems() {
    console.log("loadItems triggred");
    this.groceryService.getItems().subscribe(
      items => this.items = items,
      error => this.errorMessage = error,
    );
  }

  /**
   * API to trigger adding an item.
   */
  public async addItem() {
    await this.inputDialogService.showPrompt();
  }

  /**
   * Remove the item at given index.
   * @param index item index.
   */
  public async removeItem(item: Item) {
    console.log('Removing', item);
    this.groceryService.removeItem(item._id);
  }

  /**
   * Edit the item at given index.
   * @param item the item to edit
   */
  public async editItem(item: Item) {
    const toast = await this.toastController.create({
      message: 'Editing Item',
      duration: 3000
    });
    await toast.present();

    await this.inputDialogService.showPrompt(item, item._id);
  }

  /**
 * API to share an item.
 */
  public async shareItem(item: Item) {
    console.log("Sharing", item);
    const message = `Grocery Item- Name: ${item.name}, Qty: ${item.quantity}`;
    try {
      await this.socialSharing.share(message)
      console.log('Successfully shared', item);
    } catch (e) {
      console.error('Sharing failed', e);
    }
  }
}
