import { ToastrService } from 'ngx-toastr';

export function removeDeletedItem(arrayOfItems: any, itemId: any) {
  const newItems = arrayOfItems;
  return newItems.filter((item: any) => {
    return item.id !== itemId;
  });
}

/**
 * Reusabel Error Method
 * @param error
 */
export function componentError(error: any, toastr: ToastrService) {
  //let errorMsg = JSON.parse(error);
  toastr.error(error, 'ERROR');
  console.log(` error: ${error}`);
  return;
}

export function serverError(message: string, toastr: ToastrService) {
  const errorMsg = JSON.parse(message);
  componentError(errorMsg.message, toastr);
}

export function pick(arrayObj: any[], size: number = 5) {
  return arrayObj.filter((res: any, i: any) => {
    if (i + 1 <= size) {
      return res;
    }
  });
}
