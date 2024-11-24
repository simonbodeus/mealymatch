export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      meals: {
        Row: {
          id: string
          name: string
          categories: string[]
          ingredients: Json[]
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          categories: string[]
          ingredients: Json[]
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          categories?: string[]
          ingredients?: Json[]
          created_at?: string
        }
      }
      weekplan: {
        Row: {
          id: string
          dayofweek: number
          requiredcategories: string[]
          excludedcategories: string[]
          selectedmealid?: string
          created_at: string
        }
        Insert: {
          id?: string
          dayofweek: number
          requiredcategories: string[]
          excludedcategories: string[]
          selectedmealid?: string
          created_at?: string
        }
        Update: {
          id?: string
          dayofweek?: number
          requiredcategories?: string[]
          excludedcategories?: string[]
          selectedmealid?: string
          created_at?: string
        }
      }
      shopping_list: {
        Row: {
          id: string
          name: string
          category: string
          checked: boolean
          mealname?: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          checked: boolean
          mealname?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          checked?: boolean
          mealname?: string
          created_at?: string
        }
      }
    }
  }
}