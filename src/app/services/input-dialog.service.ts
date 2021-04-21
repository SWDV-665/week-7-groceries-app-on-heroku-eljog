import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Item } from '../models/models';
import { GroceriesService } from './groceries.service';

@Injectable({
  providedIn: 'root'
})
export class InputDialogService {

  constructor(private toastController: ToastController, private alertController: AlertController, private groceryService: GroceriesService) { }

  /**
   * Add/Edit an item via alert dialog prompt.
   * @param item the item to edit. Optional if adding.
   * @param id the item id. Optional if adding.
   * @param message optional message. Can be used for displaying error message.
   */
  public async showPrompt(item?: Item, id?: string, message?: string) {
    const isEdit = item && id != undefined;
    const prompt = await this.alertController.create({
      header: isEdit ? "Edit Item" : "Add Item",
      message: message,
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Name',
          value: item?.name,
        },
        {
          name: 'quantity',
          type: 'number',
          placeholder: 'Quantity',
          value: item?.quantity,
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: isEdit ? 'Save' : 'Add',
          handler: async (item: Item) => {
            if (this.validateItem(item)) {
              if (isEdit) {
                item._id = id;
                this.groceryService.editItem(item);
              }
              else {
                this.groceryService.addItem(item);
              }

              const toast = await this.toastController.create({
                message: `${isEdit ? 'Saved' : 'Added'} Item: ${item.name}, Quantity ${item.quantity}`,
                duration: 3000
              });
              await toast.present();
            }
            else {
              // Show the prompt again, if the item is not valid.
              this.showPrompt(item, "Please eneter valid data");
            }
          }
        }
      ]
    });

    await prompt.present();
  }

  private validateItem(item: Item) {
    return item && item.name.length && item.quantity > 0;
  }
}

