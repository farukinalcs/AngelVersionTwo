import { createReducer, on } from "@ngrx/store";
import { addItemToAddedGroups, loadAccessGroups, loadAddedGroups, removeItemFromAddedGroups, resetAccessGroups } from "../actions/access-group.action";
import { initialState } from "../models/access-group.state";

// Reducer
export const accessGroupReducer = createReducer(
  initialState,
  on(loadAccessGroups, (state, { accessGroups }) => ({
    ...state,
    accessGroups,
  })),
  on(loadAddedGroups, (state, { addedGroups }) => ({
    ...state,
    addedGroups,
  })),
  on(addItemToAddedGroups, (state, { item, isTemp, startDate, endDate, startTime, endTime, desc }) => {
    let updatedAccessGroups = [...state.accessGroups];
    let updatedAddedGroups = [...state.addedGroups];
  
    // Eğer eklenmek istenen item'in ID'si 0 veya 1 ise
    if (item.ID === 0 || item.ID === 1) {
      // addedGroups içindeki mevcut item'leri accessGroups'a taşı ve hasItem değerini false yap
      updatedAddedGroups.forEach(group => {
        group = { ...group, hasItem: false };  // Yeni bir nesne oluşturuluyor

        if (group?.isTemp == true) {
            group = { ...group, isTemp: false };
        }
        updatedAccessGroups.push(group);
      });
      updatedAddedGroups = [];
    } else {
      // Eğer addedGroups içinde 0 veya 1 ID'sine sahip bir item varsa
      let existingSpecialItem = updatedAddedGroups.find(group => group.ID === 0 || group.ID === 1);
      if (existingSpecialItem) {
        updatedAddedGroups = updatedAddedGroups.filter(group => group.ID !== existingSpecialItem.ID);
        // existingSpecialItem.hasItem = false;
        existingSpecialItem = {
            ...existingSpecialItem,
            hasItem: false
        };

        if (existingSpecialItem?.isTemp == true) {
            existingSpecialItem = { ...existingSpecialItem, isTemp: false };
        }
        updatedAccessGroups.push(existingSpecialItem);
      }
    }
  
    // Yeni item'i addedGroups'a ekle
    updatedAccessGroups = updatedAccessGroups.filter(group => group.ID !== item.ID);
    item = { ...item, hasItem: true };  // Yeni bir nesne oluşturuluyor
  
    if (isTemp) {
      item = {
        ...item,
        isTemp: true,
        tempStartDate: startDate,  // Buradaki veriyi action'dan alabilirsiniz
        tempEndDate: endDate,
        tempStartTime: startTime,
        tempEndTime: endTime,
        tempDesc: desc
      };
    }
  
    updatedAddedGroups.push(item);
  
    return {
      ...state,
      addedGroups: [...updatedAddedGroups],
      accessGroups: [...updatedAccessGroups]
    };
  }),
  on(removeItemFromAddedGroups, (state, { item, isTemp }) => {
    let updatedAccessGroups = [...state.accessGroups];
    let updatedAddedGroups = [...state.addedGroups];

    updatedAddedGroups = updatedAddedGroups.filter(group => group.ID !== item.ID);
    item = { ...item, hasItem: false };

    if (isTemp) {
      item = { ...item, isTemp: false};
    }

    updatedAccessGroups.push(item);

    return {
      ...state,
      addedGroups: [...updatedAddedGroups],
      accessGroups: [...updatedAccessGroups]
    };
  }),
  

  on(resetAccessGroups, () => ({
    ...initialState // State tamamen sıfırlandı
  }))
);
