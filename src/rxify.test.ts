import {rxify} from './rxify';

test('single-argument works ok', done => {

  const identity=(id:number)=> new Promise(resolve=>resolve(id));
  const rxApi = rxify({identity});
  const expected = 12;

  rxApi.identity$(expected).subscribe(actual=>{
    expect(actual).toBe(expected);
    done();
  });

});
