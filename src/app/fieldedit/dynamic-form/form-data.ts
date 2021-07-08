export interface FormData {
    fieldId: string;
    fieldName: string;
    fieldType: string;
    fieldInputType: string;
    defauldValue?: string;
  placeholder?: string;
  _is_visible_?: boolean;
    _is_Mandatory_?: boolean;
  dropDown?: Array<{
    displayName: string;
    value: string;
  }>;
  
}
