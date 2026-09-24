import React, { useState, useRef } from 'react';

const HP_LOGO = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gKgSUNDX1BST0ZJTEUAAQEAAAKQbGNtcwQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwQVBQTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWxjbXMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtkZXNjAAABCAAAADhjcHJ0AAABQAAAAE53dHB0AAABkAAAABRjaGFkAAABpAAAACxyWFlaAAAB0AAAABRiWFlaAAAB5AAAABRnWFlaAAAB+AAAABRyVFJDAAACDAAAACBnVFJDAAACLAAAACBiVFJDAAACTAAAACBjaHJtAAACbAAAACRtbHVjAAAAAAAAAAEAAAAMZW5VUwAAABwAAAAcAHMAUgBHAEIAIABiAHUAaQBsAHQALQBpAG4AAG1sdWMAAAAAAAAAAQAAAAxlblVTAAAAMgAAABwATgBvACAAYwBvAHAAeQByAGkAZwBoAHQALAAgAHUAcwBlACAAZgByAGUAZQBsAHkAAAAAWFlaIAAAAAAAAPbWAAEAAAAA0y1zZjMyAAAAAAABDEoAAAXj///zKgAAB5sAAP2H///7ov///aMAAAPYAADAlFhZWiAAAAAAAABvlAAAOO4AAAOQWFlaIAAAAAAAACSdAAAPgwAAtr5YWVogAAAAAAAAYqUAALeQAAAY3nBhcmEAAAAAAAMAAAACZmYAAPKnAAANWQAAE9AAAApbcGFyYQAAAAAAAwAAAAJmZgAA8qcAAA1ZAAAT0AAACltwYXJhAAAAAAADAAAAAmZmAADypwAADVkAABPQAAAKW2Nocm0AAAAAAAMAAAAAo9cAAFR7AABMzQAAmZoAACZmAAAPXP/bAEMABQMEBAQDBQQEBAUFBQYHDAgHBwcHDwsLCQwRDxISEQ8RERMWHBcTFBoVEREYIRgaHR0fHx8TFyIkIh4kHB4fHv/bAEMBBQUFBwYHDggIDh4UERQeHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHv/CABEIAZABkAMBIgACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABgcEBQgDAgH/xAAaAQEAAgMBAAAAAAAAAAAAAAAAAQIDBAUG/9oADAMBAAIQAxAAAAGqRnwgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAff1ONbodaKe24lkq2+/uybY6y/NjI7Vh3lM4ZfEGfUAAAAAAAAAAAAAAAAAAbnUWPpdT0rjb52vtyKFSWH1yST33VbUvkWBg6FOg8Ts+aCagAAAAAAAAAAAAAAAAD3i2/3mfX/G9L4WRpsVEdmMaml6RzD09j3x+db7bUZ9MN3mAAAAAAAAAAAAAE1zImvmxtAp562WVekvuRNZNbCZxuwuZ3NHHsOfJya33frEyOJSWD1ySLY7WuaZMMdrzAAAAAAAAAAAAAAG26X5St6l65u7GqAm+tunmWHQnPHQVcFwc8yqfxNQ4+g/Nfo7qS5MF0unhWTok1jcpjc6tjj8Q9fLocgM+oAAAAAAAAAAAAAAyMcdSUVsrWx5Ijk0502jnzoLnu0CmOi4ZCpZug6E5lx5phFvCcafV2Fbb/AMq2kkaktdRb8HW86AAAAAAAAAAAAAAAB+9H83yatpL+27zJE9AUJ0NU0Ls5vnkrT8RuvekzmKdQnx1eh4WRH8rU6Ma1Z1vPhfEAAAAAAAAAAAAAAAABeeJVPTWPJQd6c8XCijulK7jsvGXTnnAuuiupKCiZPXHvrtXohvcoAAAAAAAAAAAAAAAAABYFfomworpxc9N/At+CRsTfa1mAmAAAAAAAAAAAAAAANj47720Ovp8eRY9b42D+7m1NDiTDEy67b73zz6cZ+JhBkbzR2Npk4cesrVGrjGut9EY0Nh48TV22sZKq/mxyIZi2XmJq7P3tZzEz01h1pDSC9QAAAAAAAAM3zxlMuyx8VE73AwUWy8f4XxbzRlqSjIh6J3f3oRu9X4JT6LapDc5sZGxydKlu/wB0aG69o+N9s4cJngRsBMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/EACkQAAICAgICAgEDBQEAAAAAAAQFAgMBBhMUEhUAUBEhIkAWIyU1kGD/2gAIAQEAAQUC/wCbEYyl8zXZjHzit+Z/TMYTliUZR+YxnOeOz6pQPwDvCficblvOI649cZ33UVxopZE9glKNx1OyfGv6hUNzkF3YHo/fdcJTgehqTzkIxvGDknipXj9gi6yNNN1krbfp8YznINGBx3BPLejG+NyeAcKjJBEswpqJtlfesH64zsnys+oRjeU2ZPXGFplffjEKajb8kEKRuAd4T+qYblvOIwOPnOc5+norldbVCFNLAjskJhuKh4T+IqRucgu7A9H77rhaY0UNSecj6hIN4VuyfCpaP2CSLY0UzlO64GjA47gnmvRjfG5PCP8AztcTjNoP9bytDXU0kGz0yHhbCdVivWRWAOwqZqS9cVjtbXWr5BA+AD9kiycKab7JX3Lh+uM6J5LUY3lNoT1xxaZEX48KajL8kEfzlB01zD+waG4BmuYaiz9gu3tZ4W6Sz6p2xLsMlod9wJoZFRwWxLsrWSCVfg8J8pJRuS5gR1h6a5X3VQhTSwI7BCYbioeE/iP0Ghs/m5rO4AhYSWsSKqTgmItoB2sMvZLd5WdcvRWfCTtS32K2i2dF0IzuuHqjRSzI7BKQbwqdk+FSwfsEkWxoptnKyz6Ae6we9UZWwA2pb65lorPlo3hZ2BNaZetZnjVHgk03AmoGEWS7dFvTPR5rwW5J4qAB+wRbOFNN9kr7l4/XHdE8l30Wks+odsK7DJaJfcCaCRSeFsa7K1lpDPshb2s5KdTZevZNwq2K+yFopJN077lY3XHeE+U0o3JaxI6w30mrsvZLN5WcBWjM+AnaVvslqwuxefVOg4J4BJax05n3l++LP1X8fcNvwOPCM7rh6o0UsyOwT9JrbHK1keNUeCVTcCbrzDDJbuqzqH6Gz8Z7gs765KfNcwnGg0JqFYvPKJsIwjG/EXJPFR9No7Psh72s5KdUZevZNgq2AEsXhGJjoMV23LOgx0Nn5Q3ZZ2wYePn5V10FXSvv+mWF2AHU2UmhvV8lrHTWfdX74s+aaz6TB6viyXU2XgmrS6jwdnW+tZSLskH9RrWwYWD7K5AajJzprmBG1rb6Z+Pmu26qsLYTBDztYeeq+bA+XtAP/JCi5vqEp7F9AWbSBBbCZZW4zigXNowQ+Sbpx8ZolEmuJ6zOdKhHk8FinHFEjrUeq4TELYXaxCj5eol7H+l4YlJSTW3nq8Y21pCfdMwrV5taW/KNKusZmOF9iw6xERhIuVSMXJkhDKs5BxBja7ixe3XUgw/iJfxwL7AZFL/9kJ+ZJlw+CL1fhEBZMKRIQq4ien1U4ypioRTRW0S1drcmsGbAjmp9o41qbaIps26l0IubaC+84z/mWKUU/YcGwM3kwYfYLWBlZms6+vuq1vZQLbtfHY+s1qQI4iU2Nl2jQpvlTfYBXqbaxdZZ/EHJsogNdKi2oy2q4e+0ec2hOcVE2V0C3zHtnnyktZkL6/ip4YtGO2E0wRgzIOFLaklgtmZDKY91o92NsZ+GGBXsSGRVzSTonLWZpOSaGRFKxozIYxWsyAKiGRF60VuYOvVNjVmWGxsDBxNkPGEbOSmVX/Pj/8QAKBEAAQQBAwMEAwEBAAAAAAAAAQACAwQRBSExEhNAEBQyUTBBcFKB/9oACAEDAQE/Af56/ThFX7sjt/pVtOEkJlecBUaHuiTnAChpd+ftsO32rkDIJOhpz4ml1O/Lk8BWnm9ZETeAtSkz01YlbeKVYQs5KiA0+p1n5FOcXHJ8NrS44CmIoVegfIqowUqxmfyVpsfytSqqw3rJmfwFqlvvy4HA/PhYWFhYWkVhvO/gKIHULXWfiFcebtkQM4C1KXAbViVlwoVRE3k+A0rgo/aP2uQvfF1YQNG6eRp9TpHyKpMFOuZ38labH1OdalVyybEpf4PIQ3Q+lwoJOzKHpmdRtdR+IV55tzivHwFqk4hjFaPwgUdkftcobhVL3t4XM/aoMFWA2JOSppDK8vd+/DG6H0hsuFwcrUL/AHw1rePFysrKz4MVON7YznlNpxHBx/r/ALhRV45iD04G6nrsjha4HJysLCwsemFhYWPy95+2/HC78m2/Cdalccly63dPT+vTKz6ZWfXKys/zX//EACgRAAEDAwQBBAIDAAAAAAAAAAEAAgMEETESEyFAURAUMEEkcDJDof/aAAgBAgEBPwH9etqy+bbaFNV6JNtouVU1WzbypKjai1uHKp5XSt1EdStn2mWGSoWimh3DkqjZmd6p2mpmMjsJ5NXPpGAgLcDpk25KjHu59RwFO41MwjbgKsfiBincKaHbbkqig2mXOT890Srq6BVfN/U37Tz7SDSMlU7RTwmV2VRsved6haaqfWcDoOH2shDnhN8L+JXtgJjK5N/LnucBVLjUSiJuFWPsBAxU8O1GG9HBR4N07yjyE9u4wtTrUkFvsqmaIIjK5UURkeZndJwuhyLJvhDgo8FT0u89rvpVTzPIImKNgY0NHTPBTvKPIuhyEPCpaXaJcc9QhWQFlZW6L6hzS8WwjUPH+J8roxm5UcxfIQVdXQKurq61K/K1eg+PQ3njK2meEIIwMLSL39LK3pZW9bKyt+tf/8QAPBAAAgECAwUGAwUIAQUAAAAAAQIDABEEITESEyJBUQUUIzJhcUJQwYGRobHREBUzQFJi4fCQQ1NgcpL/2gAIAQEABj8C/wCNjhBPsKuUYfZ+z+G//wA1YirqjH2FcSke4qwBNfw3+75VtMON8zQwyn1at4w4E/OjJz0X3oKM2c0sa6LRI8i5LW/YcT6e1d3U5t5vb5TdvImZppTy0r+p3NLEOWtWXyJkK7wwzOS1ul8z/lQX4Rm1F28qimkbVvlFgLk0I+ere9btfIn50cSw9FrZU8b5UsfLn7Vc5IgppG50L+ds2ru6nJfN7/Ke8MMlyX3rI8bZLSxjnrVvKiCmkOnL2raYcb5mhhl92resOBPzov8AFovvVycz8oWNdTQRclUUX+EZLW9bzP8AlQw6nM5tW0w4EzNNKfsr+p3NLEvLWrKeBMh8p37DN/L7VuFPE+vtQB8i5tTSNoKLHNnNCPnq3vW7XyJ+dHEsPRa2F875fz8gbFvFMnw7N8utd5imaZQbPdbWqODESmJHNtscqOxjnLWyulNHINl1NiKjxUWPkswzGwMj0pY9oyRuLo9re9SQyYpoZFF1AGop8TBiGm2M2UrbL9gT4dWouclUU0jasaC/Ec2rcKeFNfeu8NouS1l52yFLEOetf0ogppD9nt/Px4pPh8w6jnXKSGZPvBqTCvoM1PUcqCSHx4eF/XoaHaUS8L8MvvyNdzlbwZ9PRqeEfxV4oz60k6XWSJtPzFJPHxRyrp9KeEDwm4oj6U6fHr7iu7qchm1b5hwpp70W+I5LQjXVjQQZKoov8IyWt6w43/KhhlOubfIW7Mlb+6L6iu8xr40GfuvOkxHwaSDqtNE3HDKv4VJhpPNGcj16Gldj40fDJ+tDHxL4c2T+jf5o9nynglzj9GohB48XFH+lCRPMKCjN3NLGugo2PAuS1v28z6e1bhTxPr7ULjgXNqaRtBTSNqxv8hSeI2dDtA1Hio/iGY6HmKOwPAl4o/TqKPZ0rccecfqvShjol8SDzeq0sjHwX4ZfbrUmHkzSRdfrTRPdZYm1+tJPlvBwyDo1d6jXwZ/wbnR2vMRw1ulPG/5UE+EZtRc5KooyNqxoL8Rzatyp4U19/kfdJW8KfT0anhy3o4oz60k6XWWJtPpSTx5xyLp9KaIDwX4ovau5St4sHl9VodpRLxJlL7daCyHwJuF/Toakwr/EOE9Dyoo10liax9DRkfU1mON8zXd10XNq37eVNPei3xHJfkqs58aPhk/Whj4l8ObJ/Rv80ez5W4Jc4/RqYIPHi4o/0qPEx6ocx1HMUHWzwzJ94NSYY32NYz1WtxI3jwcJ9RyNL2nEv9s30NR73y3ppOeg96CjNnNLGugokeRcl+SrIx8F+GX261Jh5M0kXX608L3WWJtfrST5bwcMg9a71EPBn/BudN2bK2R4ovqK3sa3ng4l9RzFR4lb20cdVog2eGZPvBqTCyfCcj1HI0gf4BajiG1OS1ulPG/5fJ+5St4sA4fVaHaUQ4o8pP8A160A58Cbhf06GpMK/wAQ4T0PI1bOOeF/uIqPErqcmHRudGSMeBPxL6HmKbs2Vs14ovbmK73EvjQa+q86G15b51tXAjUfhTStz0+TxYqLVDp1HMUsi8cMy/hUmHN9jWM9Vru8rePBkfVeRpe04l/tm+hrcSN4E+Xs3KpMObbeqHo1LIt0mhf8ajxMflkGY6dRTKo8CTij/Slw3IHX5S+GxCSSR3umzy60oSCZJ4zwsbfaKjxKZgZOOq08MuExDI4sRl+tHYvs3yvrUceLhmeZRYsts671hYpIyw4w3XrUkcyPJC+dl1DUYe7zrIp2o2Nsj/4nK4cDdi+lCINs351LDvAN3ztrRCWAGpNHdYqJ2HKpZtsDd8rVuw2zlfSmXobVORiFhENr7QvTPge0MNi2XMohzqTFvjI8Mkb7LbYp507Wws7L/wBNNT+NQzzdqQQCVAw2xb60kpeOaB/LIlLv+18NEWFwHFvrUeCwWIixjOt9pNB71uW7XwwxP/b/ANNR9mz2jd2sG1HvW4/e+F339ByP50vZczLE7C4bUWp8LNquh6jrT9qtIEQeVLeYaV3eNgmW0zEaUcNIwbK4YDUUnakbiRSNpkAzUVisYJgow4uVtrlemn20gw66yvUmKwnaGHxSReex0qHGTdpQYdZRcbY/zSNF2hBito2tHy/lcTtC4tnSiCB1fqTWL/3nUyxee+dqMbFly5Vid4CUBzFWghdGtqTU5xvaPdWEhsNi967Whjm24bBRLblxZ0+MPaqYp9jZCRjWu0J8XEzwtOzOin2oDs/BTwy7WbO2VvvrstZ8dHhLRjZ2/i4RWG7FQvI19vbI5Vhv3nJiFfd8O76VjEwDOVMI3Rk19aaF45O87els9quwY5CDiQeP8PrTSN2kiy8JMIHFkKgCKwEKtHmLXNjTKWEc+DxBST1jvXaW4UCCFhFHboNmp5IjGmJxgspc2sv+3rD4iUo+JwotIUN7iuy5mXajY7Eg9M67TlwbhsPiIjIluXDWE7oCVU+MF+2/408iRyGNfOQMh712ce0MPJPHlYIbZ2NIezsNLAoHEHN7/wAq6Js2fW9CRLXHWpJVC7UmuVbUTWqwCL6gVJCLbMmtbyO17WzoseZvU6QCO04s20P2Nh4FhKM21xrenw0seHCPkdlM6w+HmEexALJYfZUWExAjcReV7cf31G2IEYMa2GyKWaFzG65girbGGL/17GdLj3feTq21dq/eN1Se4PCMsqXtLdwCdRbJcjyzqfELIY3nvvNg2vepez1Ee5lN2uM/9yqFZhGqQiyKgyqeGIRtHMLOrioOz3CbmE3WwzqXAKVaCQEWYaX6Ue7ONltUYXBoweFDG3mEY1qPDImHKRiw2kpY50hAVrjYW3/Hz//EACoQAAEDAgUEAgIDAQAAAAAAAAEAESExQVFhgZGxcaHh8FDBQNEQkPFg/9oACAEBAAE/If62CDF+omAYXJ/x/pkBcAIyTIHmlXZ8hP5GADoiDkA6/iqJNMFgntydgs6j1sQHrCYo6FfeUcKKvJRjInYcdV+pV8kYV1y2a/Exd3k2CZhwMTYLPbqSmYcTE3KmzvJuU4cZbnVTPHOXkjnwe2+UxsP8AR05n+IEzoACCprzElN1nrcvQnErIJshcoKHvPBClraQE605wMBYJmD7DaJqlbs7NPiXP1QOiePbHOicTnLAXKaJthATiVg4WKwD6AsE4RpLwF5JNiie6AoRGGQn4gJc7eUyt6xRAxO0jyoDbt2br6plsF9gNNgm6YpxNkA2ndSU2gbmJuU59xOJ+JcW0WTyTFCNPkm4+g2qoVdOAnsO+oKmvMfXCkSVutxXoTiVJEbMhc/nnWK5EHWhOKFG72BNDGais/jvNHezoUrxNAxNnlFOkz7EVQ4DdNVYogXlEmDr+0xUpEi9W4RQnFLLyGw/gjOWSZJhXj7J2i04CCaA77horyrX4JwHzOOn2nF/uk6JwnEwFygYhthATmTGBws9z/PclLmx+j3BAu+xgk/IS5vq9uFIiy8ZH7OQrVQACnoGyemBaz096bIXA0MNtaK6uVlBOtE19UFnqXCOw3ptpRMmGe4+lEw85bDRahtfwQw5HffCesNZyUwr7xRH40jAeV4JNiqBbGw+BcEkHfPrjuq2hkWrafaCcknEuV2qmJa2DUhBHKK0R0qqDqghKl521KoJwjX9VCqC0x6g1HcJmkuZ2Ood2RhGxR2Kcw7yU2UzXE3KdnejE6pyHwfL6TFxj5Jme0NqmimaYmwRUXePgTGx+aCb0A9uLp9tuxR+gexUxwXyepo4U2woge7V6OjGgQ3ZoKbiYAFjUByiTUexEgOdU+8IDYrvXVURFJLCLbWu6CA3vleCTcjNxrGXlMK+sE7YYg4CGfA774VQ2+8Pg3FocAiYt702QuipVh/dFUxWWUEuEydNF3LhHfVLNbSicnAqjNvamytFYgK26OCo6WZ4L6OCmRRMzTqQp2CYCYWwBbJMPtLBMB8BxsNFEvN8EEER33HREklyS/PwYJBcEgjNBAhi87ah9qtIQjX9VCrJch0deUEKnUzfUO7J2b7/AB1WOMiwoUOEqpep+tE0ughwz7g0TECLCA9cNl75ez6o6GtcUcY76VQqa8lOx9B9fhTvKF6UqrEDBbAOUWOFhiJAcp3gRKw/uuqoVKSWEW2td1cGXzf0O6cJQYE+wdE4+E5mqPvquwkpJ4Te9BT+UcUxPhbleATdv8O4PJAnp7U2VDubArZo4Kj7Yngvo4TTuErCMrixCb3AcnUKLVyGPYI6q5tOmv0KphcBJYJttK7px2QxHBQRwQRgXQQMBYfDliNa7/YCa7pJuQkFAqJ729TaiYnAQ9X2AVoE0PXDZUvFBuYvPpMVNHqfrVCAog2AyDwmnNSKE1RylKfAX0HsQjFOeVFh8Tbtv3M0SaXTr3I7GNRih5Elia1R7dHa1bTBRh3Oy1nzVDTvjaGTVlQoVxIWMbhCKMKYZqcRwos+FqJoR/ydNIi6CfpHFBATB6Ifie5MunweCqLuXt9oJblchNqzuLqK9ryDA4RygXzyQJC8AMT3RwALWwEkvFUwzRiCYtHqiEDpG8ALTKqPPVi4fArFrgMapWpdb5dzlmqpGQQ2+F3ZAdDm7oNAxCdoDmA5TSJdkabEYvgCXHVk1YaaItApH0km4HPaVD6G5AI8qOc24DeYWrK+EZsif9EPjcsqEs0pardEEC84jB7iNEC4cLcmzlCmc5EGsyfxTE5mTMmKYgctAEdVz0AZmdtVvpBYoMuCkIlqpDKUI8lumwlKbxQBbkmOygiuaeThsTheEzKQUSC9gYTIRC4QFxV6FQf3HcYRIRiJAJuJExqaWCOlvOMTwUbBTF7yyGIJyce6vlCAEN4r6AoxCELNAM/pFdvy8AUwuuuc59d3Wbswqz2ygzofp16O1CFUm19N32O6CARzCXiYQrsjRM4GSEQn3UVNhTS93/KQkqAX0Kios6IoJWSzSfxQmMWaQO5VGKx6kwxhTiTUEQeqdazmu6DCdSRKbQdpRW45i1R6qbpiRE5/wQEk3CcgDHJD0a6QVPBdBiKOyQwlOSaMG+bG6sMlQ3A6M5KIbt3kIB5gab7MoH5AbgkUDC2SCDEiFqBqdEL5tJyUSB6srKPAATkdEZcl5hoXSCMGgDfJT0lAFGxwKrsITHUvmjO5DgtTVCvEp6WLWPREmwMxkbhyVNvfhLDVVH2qOzY/18//2gAMAwEAAgADAAAAEPffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8A333333333333333333333330+BWn33333333333333333332R9QeP733333333333333333/AITHQ9f999999999999999x2+++ZrFO999999999999999uADji4wNzW999999999999999tsjjc2sBw99999999999999999K8HgAbb8999999999999999999knEMEG9999999999999999999+8tNN99999999999999991+q9oNUU/mw7wgj9999999999ueMONOucuOsuuOv999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999//EACgRAQACAQMCBgMAAwAAAAAAAAEAESExQYFRYUBxkbHB0TBwoRDh8P/aAAgBAwEBPxD9enaiMU3dDX1lYeusXg3+ovcirfp6awluHWmxvyxhitcVnp4TAe+93YiF9Z934JeF0sP4fLGy73u86EcD9uxxqxC9r4M2drpD7/bu8aEDjpHsc6svtdaX+vwQiOkex8ssH2zv1fz2q4J0gnSWuoo1l7sDz3eCLR+s0OdWJJmz8vGhKp9LPY+WOD3vd+Ca/n2H/AKaQ2UjDfOU1ubcu8Lf7Pd4MQ78GPLY5cx2XWl/rxoRiaaHY2+/BSpTHWUMqlplg3P+kTpyxfMmfl4MTF4UX5dOdXwVTMlkOyOFk0EMoz0e+mfLUmjuY8tjliwZV+DVKY90yUxyuLRJG6AKd+nkeEFMkUtxTrFpTL1XgWGDOxW3NY4giLcg5swEQl43KWF31K3hkkQotUVjMBWYgIiJuoAxErNMrEDaIH4wMV7WbxzM6Hkp2XX1gxSgnDr6xYNwyHdly2ktL3imWlst1lpbSW0/Wv8A/8QAKBEBAAIBAgUDBQEBAAAAAAAAAQARITFBQIHB4fBRYZEwcHGh8bHR/9oACAECAQE/EPt7lSDe/mKNs9/WARVraOFJbe8A1r0/HCZ02Dqxn4mh1ZUP9f70mgU8DrCHYt3nBJoHBmXQIiH5YOerGI8MvSaf9P51gFPDL0JiTceh9et1BNYgyylXAckejU1dDnAHuW7ymqg8DnrLz/X+9IwPwwdXgNpPmjpaKm0NCLCxV8+0KvatvmaJLxeUL272OesIjXf88FHAgvGDNM21ZMH73aa6b/m3zOUD+e2nBUI8iKm0WJgzEuRw1P3+95oFHj8TQYODOYg2wYk0THhcbNU4/HfhASmACoOiBGyVu+BKCdiBRi8y0L9Fu1mWNDETY0X4zCgQAw6/qKtqCWotkHVxRvBy2IStvBXNxq/TWy9z3mBKZw8tJUgV/wA0gCJllSmspK2gDSUlEoqpTSUu5TWvtr//xAApEAEAAQMEAQQCAwEBAQAAAAABEQAhMUFRYXGBkaGxwVDwQNHhEJBg/9oACAEBAAE/EP8AzYQlZKIo8UyuiTA7UoFYK/SfqliGhGCPI1cgMSBPYUCOkpJdSVMm7zl6FNzMlUgDdj8UpxISZ/cXl4p1ZSHNWftfFZvOX4zjxl8U7pO71seDL1WrSS6VZV8tQUoK7S5TtvUiEi4Z8l+oqbgDEs/7r9RVtb2cNHk9jn8TEyYZsfct3gqSkiN3+zPFf6BO/eipKUZ3f7McVNzZYsfctjgrAYoOn3Fjg5qBisI51/p1NZmyjbp2rVc+VBbFg7YCpvSXsGgcBY/EO8APlWwFTuHZ9zwYOqzbdsxiXjB5qZsxJvp9Z5qRjAw5/cDvioq2H0svbg5avWMtgFg+Cu/JeKwdHvRwLDvi48HvNetxFo8Hu8ficjii66vB7vFTWKTfP6XvFXG0uz3To96K7pMGy1DATP0sO9XlqLjAkz+4vLxWKOBt8+HL4rIBxJxnHjL4pny5GWPBlpjSL8q3V/ET9hh0DVcBerQgpbWLq7utYyBnR17V6moLEnOcfJ8VgWBDT7jd4jeouRBNj7lu8FT0Ewuvh/fFEB6id++KsMGd3v5H2q5xLHh/a44PxNrxRvnfL2OaseSmZ2/K3U08gxvog28ntNWWbM2lwHbarrbINUwB8FS/MXrZ8GDimb7jGPqMHnevMxvp9Z5rFdUOf3A/z+eQEYuayENpCRa29GXgHVsMmTB2k5ohDGXFMIJQFm0zRGQg+DYiQLlKz9SFdAekrPNUCdm3HqIdauQG+MsoKAecBoBDMRUxQyRJszo01axAaiTLYptLp/xrBYehyduCrwJINAQD4Kn6WxvBgOixWRMrl8Bb1qJkSoY/zW7msnYg66/BY54UFvyb5/SxzFRkpzs908e9DfSIaowTT9LD7ef56KJhHG8pc2Q1BXmHsiz4auELds7tizslWltoA+2IeTerBiaNcL2Enc3VZ0EVrC+A3c1MKvrRMS2ErudKv0iZS6gdhKKvYRYWxBdxlHFXsRRqmvd3eHWsZPdnAR2z3WR5ENfqLvLxU1ITg0/RfuKxElc9ehes/jneJunRK1ZDBLsXV3daH+Q+jr3k1IQDEnOcecvitKDc0+zl4jf8DrJp0sl1ifWseoB3fKmPSa03ot/Rhq2Dk5qwFO+JpW5YO8NW7SS3wkhNm2lJzQa9Jg2N+5NKshwS0JPQBPZvTRetbQlngrfZQy0pi7D26DhSfNUi0zZD5K1GHOqSr8ta3Z46ydt6eRJT0B8j2irBIQXO/wCXsN6sEBLPT8vaaWRIX0Qx5Paa0+zx0g7bVITxeXQ4MH4EiKy0SSdxwmparJBsyNk69RDrT3J4LhfdLcFXkCuJWxy23LirgOl6VleV+pWGGelE4N73UmtY1TI6ybjAqLYvCjSuzYOwoycAQGGwgccKwqdby4DD46VeycfA5HaY81gQaMZxrzg80/cA9Dp3gVdDFBsWB3YKweObxoHRAVmZK56dC1RUwYY1/RbufwegDrRs+A381OM4azAuwldzpV8kFjdQuySirpwoLE2LuMoq6oCcLXnu7uIdatU+K8bLld3FbhA3SdhuUw/AVfR0jIe+YeTalA1TswenO4prTnyalPxJbcrG2QxksDiifFBvn9JnmayUwmr6i7y8VMyVgONP0X7isAZXI9gv6UzcbKuU6/gybmESCJhHeoMI69Jg2vdw0pYWgloC3ABPZvVox7WiL8QnoN6kCo8XI9O10WlDFlG0lugk4YdKuCMi8hEN7omjUpw7kmc7l1yqvjQdp8zBLmWteesCw3zasNponH1rKmbZvWx4MvBWvmx1SVflq2zdu0uU7b0sgzluDfye0fhROodDNtDd+iTWhyIiKzbs3GBUbB8kRJXZIDtSy4D2JY2EDiGlQ8V3vPgMPPGlvzpxZn2Wm5vpYoWhDPPIQ5hrVtJ/2XmMOBWokwuWBNmGTZqQwyYswOzOzJpVixEjzPlIK1lwHT7jY4nesVDRjONfA8/h7H/ZpWOy7uKXwT30ze5bD9FPM+kZD3TDyahQElxFcOnO5JrWjetmyJuSSbndWh2vgdM3OEavJ6FkZ44WDaGlXAxVmGR7MDZdqCBpW8eRw8c6JLKRmTunMUw0PhQLR4xVtyfT28B7/h1AJVoJZOJDhh0puJzlI4G+RNGSnXLdKctW5clXkJD2XMgdgLmo+DHib5tYycZ2nxjM+xcUzEOfoGc7N1wqnDFxsULZujUmgLVwsw+QJHOdaKu2UZ9doo5KUch3XgZfTb8S4EZBlCK5gQ2Z3rb9g1UhYYEtZDdq1cITE251NgNL4G1gQ9tnRoEoEmBdugoQzDmi2gleFZWUJtmaQGVES2JK8AzqTq1C6WEBAgQRYb5HNRGEhELJBtwMcOn/AMmWhkNOkCJFJ6p1AQnFqnKnKSQwE2r+usk2uvFFQAxmGbijyRQ3CeQxlZGKmdLnC4IgTemcZyGJhiacuFUSayCAL5qAZk4jZCl0ITvUpUMYaVJBMYdauVJ0hVYmwy2xTXq2dqEBAJiiDHYLRIDiQURRjNECIWlrIHIb0WzVcQgACAkzhLTFQkbkCZYuHz8VJCNBukGMHCNmGmUGpwBIuXDa6gBs1BLHCkhojnFTLMKQq8zRPRk0q+6HzaTIApizITqUfML5aQoJMoC+vFRTVcFMgzEBV8lBIO8J6M5QQvAQXwNOccOplgQwjDRQTOQMBtO5UDebVDfiZOEY7JF0ltUekwkBbYLA4pXjiiQmxacafxS6FBy3YdlMMU8ICnXpx/xy4g10FSHZT2p+5y8kQhneaTguWIzIYu91dSdcFxJlxpVzfJZKrIxDaKPOI1HCaiCGUoRImJk4JSohQM1qYRYNhCFNSgzFDsbA3FS8UueyDhBkvEG+aluISw6WJYoLqNyiUNhlUiWqmrTlUmiIiDDeMFJnWTDsGrLcHc02IRkwQKuzB801hK7EqzJAZwGaYIuJQMrhLBOQnWnT6xZOJOUWcA0tRx/QgbY4VY6U5V2agUgsqGD0aniqYGHYFSHktNb49xpQ8ggxqSa1cOG0CCOVwyYcUoB0CwUhLoNPDirwgKJHIWzicUmsJU2SS1YzrRgkm2rcmIDk/itcXYLEJaEiy0nQYCQshsJTGkkGbnBNr09xVODsHPzSXKZPlcntU6plpuIYZ+quaBcJDE2E2rDUhxKliimJngAVohh5mgAA0q/zAcQuEiBpRXRhWAuHFzailuVgLyoWBgKxdVURENhGAzdA5Jpmop8qRbpG3FWQhWL9iWRslmhoxfeZAZeI4pnJEYABAwCApErvAQNy2RCLeWkjIR5m4VCiRMG1JVO9WictzotSn3CpaQAFmm9PNKreAmFXgBwUPEztySQBCoPjajhhIJIAkQ2WhT8xFBQnBdMwiTeLtO86szLZBgtKF1mphluWMiEHWInDagzB2VEsSfBUk5srSQVUkP8A58//2Q==";

const RunakiSVG = ({ width = 78 }) => (
  <svg width={width} height={Math.round(width * 35/137)} viewBox="0 0 137 35" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M51.7881 20.5134H50.5541V23.7089H46V11.0017H52.5023C53.7504 11.0017 54.8377 11.1963 55.7623 11.5822C56.6887 11.9698 57.4029 12.5254 57.9032 13.2523C58.4053 13.9793 58.6563 14.826 58.6563 15.7941C58.6563 16.7024 58.4371 17.4942 58.0004 18.1729C57.5638 18.8516 56.9326 19.3889 56.1088 19.7881L58.9445 23.7089H54.0828L51.7863 20.5134H51.7881ZM53.6019 14.6946C53.2925 14.4351 52.8294 14.3036 52.2124 14.3036H50.5523V17.2812H52.2124C52.8294 17.2812 53.2925 17.1515 53.6019 16.8903C53.9113 16.6308 54.0651 16.2632 54.0651 15.7925C54.0651 15.3217 53.9113 14.9541 53.6019 14.6946Z" fill="rgba(255,255,255,0.95)"/>
    <path d="M62.4202 22.4197C61.2622 21.3667 60.6841 19.8896 60.6841 17.9899V11H65.2382V17.8618C65.2382 18.7933 65.415 19.472 65.7686 19.8946C66.1221 20.3187 66.633 20.53 67.3031 20.53C67.9731 20.53 68.4823 20.3187 68.8376 19.8946C69.1912 19.4704 69.368 18.7933 69.368 17.8618V11H73.8443V17.9899C73.8443 19.8896 73.2662 21.3667 72.1082 22.4197C70.9502 23.4727 69.3362 24 67.266 24C65.1958 24 63.5817 23.4727 62.4237 22.4197" fill="rgba(255,255,255,0.95)"/>
    <path d="M89.6633 11V23.7072H85.9207L80.7868 17.935V23.7072H76.3494V11H80.0938L85.226 16.7722V11H89.6633Z" fill="rgba(255,255,255,0.95)"/>
    <path d="M96.3583 21.4932L95.4514 23.7089H90.8213L96.7261 11H101.202L107.107 23.7089H102.399L101.492 21.4932H96.3583ZM100.235 18.4074L98.9235 15.2119L97.6118 18.4074H100.235Z" fill="rgba(255,255,255,0.95)"/>
    <path d="M113.761 19.4953L112.738 20.5666V23.7072H108.262V11H112.738V15.6111L117.175 11H122.134L116.731 16.5909L122.405 23.7072H117.138L113.761 19.4953Z" fill="rgba(255,255,255,0.95)"/>
    <path d="M128 11H123.446V23.7072H128V11Z" fill="rgba(255,255,255,0.95)"/>
    <path d="M3.00121 22.1253C3.00121 22.1253 11.6608 18.0844 25.6074 18.0518C22.6829 19.7929 22.0145 20.7011 22.0145 20.7011C22.0145 20.7011 31.5423 19.5018 37.717 22.1545C31.7191 21.6206 22.0278 22.4827 15.64 24.5004C15.8035 23.8698 17.316 21.8004 18.8236 20.6168C18.8236 20.6168 5.57329 21.443 3 22.1253" fill="rgba(255,255,255,0.95)"/>
    <path d="M39.5625 11.6645L31.1669 12.7942L34.2198 5.44857L27.1853 9.8492L26.5035 2L22.2216 8.79597L17.936 2L17.2554 9.84808L10.2197 5.45082L13.275 12.7964L4.87942 11.6668L11.065 17.0555L4.38535 20.3759C6.20542 19.643 8.39483 18.9011 10.9221 18.3088C13.1503 17.7861 15.2004 17.4826 16.9926 17.3095C16.7589 17.1993 16.5252 17.088 16.2927 16.9779L8.41905 13.2494L17.8706 16.1989L12.6695 8.30139L19.5211 15.0254L18.8115 5.55535L22.0484 14.6905L25.628 5.55423L24.1179 14.8265L31.77 8.29915L26.3994 15.8853L36.0229 13.2461C34.5019 14.016 29.4619 17.7895 25.8532 19.4193C29.2149 18.9202 33.2013 19.2833 36.8669 20.8615C34.9015 19.2372 32.1539 18.1042 31.4648 18.0502L39.5625 11.6634V11.6645Z" fill="#D2AD50"/>
  </svg>
);

const NAV_BY_ROLE = {
  owner: [
    { section:'MAIN',       items:[{key:'dashboard',label:'Dashboard',icon:'grid'}]},
    { section:'USERS',      items:[{key:'admin-panel',label:'User Management',icon:'user'},{key:'admin-panel',label:'Roles & Permissions',icon:'lock'}]},
    { section:'MONITORING', items:[{key:'activity-log',label:'Activity Log',icon:'shield'},{key:'admin-panel',label:'System Health',icon:'pulse'}]},
    { section:'SETTINGS',   items:[{key:'admin-panel',label:'System Settings',icon:'settings'},{key:'admin-panel',label:'Queue Config',icon:'list'}]},
  ],
  supervisor: [
    { section:'MAIN',      items:[{key:'dashboard',label:'Dashboard',icon:'grid'}]},
    { section:'OVERVIEW',  items:[{key:'team-performance',label:'Team Performance',icon:'bar'},{key:'qa-performance',label:'QA Performance',icon:'check'},{key:'evaluations-overview',label:'Evaluations',icon:'check'},{key:'coaching-monitor',label:'Coaching Monitor',icon:'chat'}]},
    { section:'MONITOR',   items:[{key:'spotchecks-overview',label:'Spot Checks',icon:'eye'},{key:'viva-overview',label:'VIVA Overview',icon:'book'},{key:'sessions-overview',label:'Sessions',icon:'calendar'}]},
    { section:'INSIGHTS',  items:[{key:'reports-center',label:'Reports Center',icon:'bar'},{key:'targets-goals',label:'Targets & Goals',icon:'star'}]},
    { section:'PLANS',     items:[{key:'action-plan',label:'Action Plan 2026',icon:'plan'}]},
  ],
  qa: [
    { section:'MAIN',         items:[{key:'dashboard',label:'Dashboard',icon:'grid'}]},
    { section:'EVALUATIONS',  items:[{key:'qa-my-evaluations',label:'My Evaluations',icon:'check'},{key:'qa-create-evaluation',label:'Create Evaluation',icon:'plus'},{key:'qa-pending-coaching',label:'Pending Coaching',icon:'chat'}]},
    { section:'CHECKS',       items:[{key:'qa-spot-checks',label:'Spot Checks',icon:'eye'},{key:'qa-viva',label:'VIVA',icon:'book'},{key:'qa-sessions',label:'Sessions',icon:'calendar'}]},
    { section:'INSIGHTS',     items:[{key:'qa-reports',label:'My Reports',icon:'bar'},{key:'action-plan',label:'Action Plan 2026',icon:'plan'}]},
  ],
  agent: [
    { section:'MAIN',    items:[{key:'dashboard',label:'Dashboard',icon:'grid'}]},
    { section:'MY DATA', items:[{key:'my-evaluations',label:'My Evaluations',icon:'check'},{key:'my-coaching',label:'My Coaching',icon:'chat'},{key:'my-sessions',label:'My Sessions',icon:'calendar'},{key:'my-performance',label:'My Performance',icon:'bar'}]},
  ],
  trainer: [
    { section:'MAIN',     items:[{key:'dashboard',label:'Dashboard',icon:'grid'}]},
    { section:'TRAINING', items:[{key:'sessions',label:'Sessions',icon:'calendar'},{key:'viva',label:'VIVA Management',icon:'book'}]},
  ],
  teamlead: [
    { section:'MAIN',     items:[{key:'dashboard',label:'Dashboard',icon:'grid'}]},
    { section:'QUALITY',  items:[{key:'tl-evaluations',label:'All Evaluations',icon:'check'},{key:'tl-coaching',label:'Coaching Monitor',icon:'chat'},{key:'tl-spot-checks',label:'Spot Checks',icon:'eye'}]},
    { section:'TRAINING', items:[{key:'tl-viva',label:'VIVA Overview',icon:'book'},{key:'tl-sessions',label:'Sessions',icon:'calendar'}]},
    { section:'INSIGHTS', items:[{key:'tl-reports',label:'Reports',icon:'bar'},{key:'action-plan',label:'Action Plan 2026',icon:'plan'}]},
    { section:'TOOLS',    items:[{key:'tl-tip-of-day',label:'Tip of the Day',icon:'bulb'},{key:'tl-data-import',label:'Data Import / Export',icon:'upload'}]},
  ],
};

const IC = {
  grid:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  check:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
  chat:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  eye:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  book:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>,
  calendar:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/></svg>,
  bar:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  shield:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  user:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/></svg>,
  star:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  plus:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  bulb:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21h6M12 3a6 6 0 016 6c0 2.22-1.2 4.16-3 5.2V17H9v-2.8A6 6 0 016 9a6 6 0 016-6z"/></svg>,
  upload:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  lock:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  pulse:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  settings:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></svg>,
  plan:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>,
  list:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
};

/* section accent colors */
const SEC_COLOR = {
  MAIN:'#FF6B35', QUALITY:'#60A5FA', TRAINING:'#A78BFA',
  INSIGHTS:'#34D399', SYSTEM:'#F87171', OVERVIEW:'#60A5FA',
  MONITOR:'#FBBF24', EVALUATIONS:'#60A5FA', CHECKS:'#A78BFA',
  'MY DATA':'#34D399', TOOLS:'#F472B6',
  USERS:'#60A5FA', MONITORING:'#4ADE80', SETTINGS:'#FBBF24', PLANS:'#F472B6',
};

const ACLR = ['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA','#F472B6'];
const acol = n => ACLR[(n?.charCodeAt(0)||0) % ACLR.length];
const ini  = n => n ? n.trim().split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase() : 'U';

const roleLabel = r => ({owner:'Owner',qa:'QA Officer',supervisor:'Supervisor',agent:'Agent',trainer:'Trainer',teamlead:'QA Team Lead'}[r]||r);

const Sidebar = ({ userRole='owner', userName='', currentPage='dashboard', onNavigate, onLogout, darkMode=true, onToggleTheme, badges={} }) => {
  const [expanded, setExpanded] = useState(false);
  const timerRef = useRef(null);
  const W = expanded ? 248 : 64;
  const sections = NAV_BY_ROLE[userRole] || NAV_BY_ROLE.owner;

  const onEnter = () => { clearTimeout(timerRef.current); setExpanded(true); };
  const onLeave = () => { timerRef.current = setTimeout(() => setExpanded(false), 200); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .sb-wrap * { box-sizing: border-box; }

        /* nav item */
        .sb-nav-item {
          position: relative; display: flex; align-items: center;
          cursor: pointer; border-radius: 10px; margin-bottom: 2px;
          border: 1px solid transparent;
          transition: background 0.15s, border-color 0.15s, transform 0.12s;
          user-select: none;
        }
        .sb-nav-item:hover { transform: translateX(2px); }
        .sb-nav-item:hover .sb-nav-label { color: #fff !important; }

        /* tooltip when collapsed */
        .sb-tip {
          pointer-events: none; opacity: 0;
          position: absolute; left: 56px; top: 50%; transform: translateY(-50%);
          background: #141828; border: 1px solid rgba(255,255,255,0.12);
          color: #fff; padding: 6px 12px; border-radius: 8px;
          font-size: 12px; font-weight: 700; white-space: nowrap;
          z-index: 9999; box-shadow: 0 8px 28px rgba(0,0,0,0.6);
          transition: opacity 0.13s;
        }
        .sb-nav-item:hover .sb-tip { opacity: 1; }
        .sb-user-tip:hover .sb-tip { opacity: 1; }
        .sb-logout-btn:hover .sb-tip { opacity: 1; }

        /* logout */
        .sb-logout-btn {
          position: relative; display: flex; align-items: center;
          cursor: pointer; border-radius: 10px;
          transition: background 0.15s, border-color 0.15s;
          border: 1px solid transparent;
        }
        .sb-logout-btn:hover { background: rgba(248,113,113,0.12) !important; border-color: rgba(248,113,113,0.3) !important; }
        .sb-logout-btn:hover span { color: #F87171 !important; }
        .sb-logout-btn:hover svg { stroke: #F87171; }

        .sb-scroller::-webkit-scrollbar { width: 3px; }
        .sb-scroller::-webkit-scrollbar-track { background: transparent; }
        .sb-scroller::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }
      `}</style>

      {/* ── SIDEBAR PANEL ── */}
      <div
        className="sb-wrap"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        style={{
          fontFamily: "'Inter','Segoe UI',sans-serif",
          position: 'fixed', top:0, left:0, bottom:0,
          width: W, zIndex: 100,
          background: 'linear-gradient(180deg, #0C0E1D 0%, #080A17 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column',
          transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
          overflow: 'hidden',
          boxShadow: expanded ? '4px 0 40px rgba(0,0,0,0.5)' : 'none',
        }}
      >

        {/* ── HP LOGO ── */}
        <div style={{ flexShrink:0, overflow:'hidden', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
          <img
            src={HP_LOGO}
            alt="High Performance"
            style={{
              width: '100%',
              height: expanded ? 'auto' : 64,
              objectFit: expanded ? 'cover' : 'contain',
              objectPosition: 'center',
              display: 'block',
              transition: 'height 0.25s ease',
            }}
          />
        </div>

        {/* ── RUNAKI BADGE ── */}
        {expanded && (
          <div style={{
            margin: '10px 12px 0',
            padding: '8px 12px',
            background: 'linear-gradient(135deg, rgba(255,107,53,0.12), rgba(255,107,53,0.05))',
            border: '1px solid rgba(255,107,53,0.2)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', gap: 10,
            flexShrink: 0,
          }}>
            <RunakiSVG width={82} />
            <div style={{ width:1, height:16, background:'rgba(255,255,255,0.1)', flexShrink:0 }}/>
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ fontSize:'8.5px', fontWeight:900, letterSpacing:'2.5px', color:'#FF8C5A', textTransform:'uppercase' }}>QA</div>
              <div style={{ fontSize:'8.5px', fontWeight:900, letterSpacing:'2px', color:'rgba(255,140,90,0.7)', textTransform:'uppercase' }}>SYSTEM</div>
            </div>
          </div>
        )}

        {/* ── USER CARD ── */}
        <div
          className={!expanded ? 'sb-user-tip' : ''}
          style={{
            margin: expanded ? '10px 12px' : '10px 0',
            padding: expanded ? '10px 12px' : '0',
            background: expanded ? 'rgba(255,255,255,0.03)' : 'transparent',
            border: expanded ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center',
            gap: 10,
            justifyContent: expanded ? 'flex-start' : 'center',
            flexShrink: 0,
            position: 'relative',
          }}
        >
          {/* avatar */}
          <div style={{
            width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
            background: `linear-gradient(135deg, ${acol(userName)}, ${acol(userName)}88)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 900, color: '#fff',
            boxShadow: `0 0 0 2px rgba(0,0,0,0.4), 0 4px 14px ${acol(userName)}44`,
            flexShrink: 0,
          }}>{ini(userName)}</div>

          {expanded && (
            <div style={{ minWidth:0, flex:1 }}>
              <div style={{ fontSize:'13px', fontWeight:800, color:'#FFFFFF', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', letterSpacing:'-0.2px' }}>
                {userName}
              </div>
              <div style={{ marginTop:3, display:'inline-flex', alignItems:'center', gap:4,
                padding:'2px 8px', borderRadius:20,
                background: 'rgba(255,107,53,0.15)', border:'1px solid rgba(255,107,53,0.25)' }}>
                <div style={{ width:5, height:5, borderRadius:'50%', background:'#FF6B35', boxShadow:'0 0 5px #FF6B35' }}/>
                <span style={{ fontSize:'10px', fontWeight:800, color:'#FF8C5A', letterSpacing:'1px', textTransform:'uppercase' }}>
                  {roleLabel(userRole)}
                </span>
              </div>
            </div>
          )}
          {!expanded && <div className="sb-tip">{userName} · {roleLabel(userRole)}</div>}
        </div>

        {/* ── NAV ── */}
        <div className="sb-scroller" style={{ flex:1, overflowY:'auto', overflowX:'hidden', padding: expanded ? '4px 10px' : '4px 0' }}>
          {sections.map((sec, si) => {
            const secColor = SEC_COLOR[sec.section] || '#FF6B35';
            return (
              <div key={sec.section} style={{ marginBottom:4 }}>
                {/* section header */}
                {expanded ? (
                  <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 8px 4px' }}>
                    <div style={{ width:14, height:1.5, borderRadius:2, background:secColor, opacity:0.6 }}/>
                    <span style={{ fontSize:'9.5px', fontWeight:800, letterSpacing:'2px', textTransform:'uppercase', color: secColor, opacity:0.7 }}>
                      {sec.section}
                    </span>
                  </div>
                ) : (
                  si > 0 && <div style={{ height:1, background:'rgba(255,255,255,0.04)', margin:'5px 14px' }}/>
                )}

                {sec.items.map(item => {
                  const active = currentPage === item.key;
                  const badge  = badges[item.key];
                  const icolor = active ? secColor : undefined;

                  return (
                    <div
                      key={item.key}
                      className="sb-nav-item"
                      onClick={() => onNavigate && onNavigate(item.key)}
                      style={{
                        gap: expanded ? 11 : 0,
                        padding: expanded ? '9px 10px 9px 12px' : '11px 0',
                        justifyContent: expanded ? 'flex-start' : 'center',
                        background: active
                          ? `linear-gradient(90deg, ${secColor}1A, ${secColor}0A)`
                          : 'transparent',
                        borderColor: active ? `${secColor}30` : 'transparent',
                      }}
                    >
                      {/* active left bar */}
                      {active && (
                        <div style={{
                          position:'absolute', left:0, top:'18%', bottom:'18%',
                          width:3, borderRadius:'0 3px 3px 0',
                          background:`linear-gradient(180deg,${secColor},${secColor}55)`,
                          boxShadow:`0 0 8px ${secColor}88`,
                        }}/>
                      )}

                      {/* icon wrapper */}
                      <div style={{
                        width:32, height:32, borderRadius:9, flexShrink:0,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        background: active ? `${secColor}20` : 'rgba(255,255,255,0.04)',
                        border: active ? `1px solid ${secColor}30` : '1px solid rgba(255,255,255,0.06)',
                        color: active ? secColor : '#4A5A78',
                        transition: 'all 0.15s',
                        boxShadow: active ? `0 0 12px ${secColor}33` : 'none',
                      }}>
                        {IC[item.icon] || IC.grid}
                      </div>

                      {/* label */}
                      {expanded && (
                        <span className="sb-nav-label" style={{
                          flex:1, fontSize:'13px',
                          fontWeight: active ? 700 : 500,
                          color: active ? '#FFFFFF' : '#7A8FAA',
                          letterSpacing: active ? '-0.1px' : '0px',
                          whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                          transition:'color 0.15s',
                        }}>
                          {item.label}
                        </span>
                      )}

                      {/* badge */}
                      {expanded && badge > 0 && (
                        <div style={{
                          minWidth:20, height:20, borderRadius:10, padding:'0 6px',
                          background:`linear-gradient(135deg,${secColor},${secColor}CC)`,
                          display:'flex', alignItems:'center', justifyContent:'center',
                          fontSize:10, fontWeight:900, color:'#fff',
                          boxShadow:`0 2px 8px ${secColor}55`,
                        }}>{badge}</div>
                      )}
                      {!expanded && badge > 0 && (
                        <div style={{ position:'absolute', top:8, right:8, width:6, height:6, borderRadius:'50%', background:secColor, boxShadow:`0 0 6px ${secColor}` }}/>
                      )}

                      {/* tooltip (collapsed only) */}
                      {!expanded && <div className="sb-tip">{item.label}{badge>0?` (${badge})`:''}</div>}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* ── FOOTER ── */}
        <div style={{
          flexShrink: 0,
          borderTop: '1px solid rgba(255,255,255,0.05)',
          padding: expanded ? '10px 10px 16px' : '10px 0 16px',
          display: 'flex', flexDirection:'column', gap:6,
          alignItems: expanded ? 'stretch' : 'center',
        }}>
          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              fontFamily:"'Inter','Segoe UI',sans-serif",
              justifyContent: expanded ? 'flex-start' : 'center',
              gap: expanded ? 11 : 0,
              padding: expanded ? '9px 12px' : '11px 0',
              width: expanded ? '100%' : 44,
              background: darkMode ? 'rgba(251,191,36,0.06)' : 'rgba(96,165,250,0.08)',
              border: `1px solid ${darkMode ? 'rgba(251,191,36,0.15)' : 'rgba(96,165,250,0.2)'}`,
              borderRadius: 10, cursor:'pointer',
              display:'flex', alignItems:'center', flexShrink:0,
              transition:'all 0.2s', position:'relative',
            }}
          >
            <div style={{
              width:32, height:32, borderRadius:9, flexShrink:0,
              display:'flex', alignItems:'center', justifyContent:'center',
              background: darkMode ? 'rgba(251,191,36,0.12)' : 'rgba(96,165,250,0.12)',
              border: `1px solid ${darkMode ? 'rgba(251,191,36,0.25)' : 'rgba(96,165,250,0.25)'}`,
              color: darkMode ? '#FBBF24' : '#60A5FA',
              fontSize: 15,
            }}>
              {darkMode ? '☀️' : '🌙'}
            </div>
            {expanded && (
              <span style={{ fontSize:'13px', fontWeight:600, color: darkMode ? '#FBBF24' : '#60A5FA', letterSpacing:'0.1px' }}>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
            )}
            {!expanded && <div className="sb-tip">{darkMode ? 'Light Mode' : 'Dark Mode'}</div>}
          </button>

          <button
            className="sb-logout-btn"
            onClick={onLogout}
            style={{
              fontFamily:"'Inter','Segoe UI',sans-serif",
              justifyContent: expanded ? 'flex-start' : 'center',
              gap: expanded ? 11 : 0,
              padding: expanded ? '9px 12px' : '11px 0',
              width: expanded ? '100%' : 44,
              background: 'rgba(248,113,113,0.06)',
              color: '#5A4A55',
            }}
          >
            <div style={{
              width:32, height:32, borderRadius:9, flexShrink:0,
              display:'flex', alignItems:'center', justifyContent:'center',
              background:'rgba(248,113,113,0.08)',
              border:'1px solid rgba(248,113,113,0.12)',
              color:'#7A4A55',
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </div>
            {expanded && (
              <span style={{ fontSize:'13px', fontWeight:600, color:'#7A6070', letterSpacing:'0.1px' }}>
                Sign Out
              </span>
            )}
            {!expanded && <div className="sb-tip">Sign Out</div>}
          </button>
        </div>

      </div>

      {/* Spacer — always icon width so page content doesn't overlap */}
      <div style={{ width:64, flexShrink:0 }}/>
    </>
  );
};

export default Sidebar;