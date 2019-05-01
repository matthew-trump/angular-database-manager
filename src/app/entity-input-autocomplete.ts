import { Observable, BehaviorSubject } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

export class EntityInputAutocomplete {

    foreignKeyEntities$: BehaviorSubject<any> = new BehaviorSubject('');
    update$: BehaviorSubject<any> = new BehaviorSubject(null);
    addEntry$: BehaviorSubject<any> = new BehaviorSubject(null);
    filteredOptions: Observable<string[]>;
    optionNotFound: string;
    addingEntry: any;

    field: string;
    original: string;

    value: string;

    constructor(
        public fieldConfig: any,
        public foreignKeysEntitiesMap: any,
        public current: string,
        public index?: number
    ) {
        this.original = this.current;
        this.field = this.fieldConfig.name;
        const _filter = this.getFilterFunction();

        this.filteredOptions = this.foreignKeyEntities$
            .pipe(
                startWith(''),
                map(value => _filter(value))
            );

    }
    getOptionValue(option: any): string {
        return option[this.fieldConfig.label];
    }
    updateFromResult(result: any) {
        console.log("UPDATE FROM RESULT", this.index, result);
        if (result.status === 1) {
            console.log("SELECTION CHANGE *", result);
            this.updateSelection(result.entity);
            this.addingEntry = null;
            this.optionNotFound = null;
        } else if (result.status === 0) {
            this.addingEntry = null;
        }
    }

    getDisplayWith(): Function {
        const fieldConfig = this.fieldConfig;
        return (value?: any): string | undefined => {
            return value ? value[fieldConfig.label] : undefined;
        }
    }
    onChange(value: string) {
        this.current = value;
        this.optionNotFound = null;
        this.foreignKeyEntities$.next(value);
    }
    private getFilterFunction(): Function {
        return (value: string): any[] => {
            const filterValue = value.toLowerCase();
            return this.foreignKeysEntitiesMap[this.fieldConfig.foreignKey]
                .filter(option => {
                    return option[this.fieldConfig.label].toLowerCase().indexOf(filterValue) !== -1
                });
        }
    }
    selectionChange(event$: any) {
        console.log("selectionChange EVENT", event$);
        console.log("SELECTION CHANGE", event$.source.selected, event$.source.value);
        const selected = event$.source.selected;
        const value = event$.source.value;
        if (selected) {
            this.updateSelection(value)
        }
        /** 
        if (this.formGroup.value[this.field] !== value.id) {
          this.formGroup.patchValue({ [this.field]: value.id });
          this.formGroup.markAsDirty();
        }
       
    } */
    }
    updateSelection(value: any) {
        this.optionNotFound = null;
        console.log("UPDATE SELECTION", value);
        if (value) {
            this.value = value[this.fieldConfig.label];
            this.update$.next({
                index: this.index,
                value: value
            })
        }
    }
    checkOptionAfterBlur($event: any) {
        /**
         * this line necessary to filter out phony click events
         * The selectionChange was sending events that resulted in spurious add prompts
         */
        if (!$event.relatedTarget) {
            //console.log("checkOptionAfterBlur", $event);

            const value = $event.target.value;
            if (value !== null && value.trim().length === 0) {
                console.log("BLANKING ENTRY");
                this.value = null;
                this.update$.next({
                    index: this.index,
                    value: {
                        id: -1
                    }
                })
            } else {
                const found = this.foreignKeysEntitiesMap[this.fieldConfig.foreignKey].find(item => item[this.fieldConfig.label] === value);
                if (!found) {
                    this.optionNotFound = value;
                } else {
                    delete this.optionNotFound;
                }
            }

        }

    }


    cancelAddNew() {
        if (this.addingEntry) {
            return;
        }
        this.optionNotFound = null;
        this.current = this.original;
    }
    addNewEntry() {
        this.addingEntry = this.optionNotFound;
        const updateObj: any = {
            index: this.index,
            plural: this.fieldConfig.foreignKey,
            entity: { [this.fieldConfig.label]: this.addingEntry }
        };
        this.addEntry$.next(updateObj);

    }
}