import {  Observable, from } from 'rxjs';

type PromiseFunction = (...args: any[]) => Promise<any> ;
type ObservableFunction = (...args: any[]) => Observable<any> ;
type PromisedValue<T> = T extends Promise<infer U> ? U : never;

type AsObservableReturner<T> = 
  T extends PromiseFunction
  ? (...args: Parameters<T>) => Observable<PromisedValue<ReturnType<T>>>
  : never;

type ObservableSuffix = '$';
const observableSuffix:ObservableSuffix = '$';

type ObservableMethodName<T> = 
  T extends string
  ? `${T}${ObservableSuffix}`
  : never;

type ObservableApi<T>={
  [K in keyof T as ObservableMethodName<K>]: AsObservableReturner<T[K]>;
}

type Rxified<T>=T&ObservableApi<T>; 

function toObservable<T extends PromiseFunction>(wrapped:T):AsObservableReturner<T>{
  return ((...args:Parameters<T>)=>from(wrapped(...args))) as AsObservableReturner<T> ;
}

const removeSuffix = (target:string)=>{
  if(!target.endsWith(observableSuffix)){
    return target;
  }
  return target.slice(0,-1*observableSuffix.length);
}

export function rxify<T extends Record<string|symbol,unknown>>(wrapped:T):Rxified<T>{
  //TODO: Make sure it's frozen, and not an array.
  //TODO: Think about other traps... ownKeys for instance.

  const observableGetters = new Map<string|symbol,ObservableFunction>();

  const isObservableApiKey=(property: string|symbol): property is keyof ObservableApi<T>=>
    typeof property === 'string' 
    && property.endsWith(observableSuffix) 
    && Reflect.has(wrapped,removeSuffix(property));
  

  const get = (target:T, property:string|symbol)=>{
    if(Reflect.has(target,property)){
      return Reflect.get(target,property);
    }

    if(observableGetters.has(property)){
      return observableGetters.get(property);    
    }

    if(!isObservableApiKey(property)){
      return undefined;
    }

    const promiseFunction = Reflect.get(target,removeSuffix(property));
    if(typeof promiseFunction !== 'function'){
      throw new Error("Bogus property");//TODO: Throw the same error as the runtime would.
    }

    const observableFunction = toObservable(promiseFunction as PromiseFunction);
    observableGetters.set(property,observableFunction);

    return observableFunction;
  };

  return new Proxy(wrapped, {get}) as Rxified<T>;
}