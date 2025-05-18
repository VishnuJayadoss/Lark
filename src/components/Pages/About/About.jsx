import React from "react";

// images
import logo from "../../../assets/lark.svg";
import Iconblack from "../../../assets/iconblack.svg";
import PrintedTshit from "../../../assets/about/tshirtprint.svg";
import Tshit from "../../../assets/about/tshirt.svg";

const About = () => {
  return (
    <>
      {/* content start */}
      <div className="container mx-auto md:mt-20 mt-24">
        <div className="grid grid-cols-12">
          {/* section 1 start*/}

          <div className="col-span-12 bg-theme-primary text-theme-secondary">
            <div className="p-8 font-headingfont text-[13px] tracking-wide text-center leading-[1.5]">
              <p>
                Our ‘About Us’ page would like to thank you from the bottom of
                its heart for visiting.
              </p>
              <p>
                It doesn‘t get a lot of attention usually, as people are busy
                surfing other, ‘cooler’ pages. The fact that you voluntarily
                decided to come here means a lot. Honestly. *sniff sniff*
              </p>
            </div>
          </div>

          {/* section 1 end*/}

          {/* section 2 start*/}

          <div className="md:col-span-4 col-span-12">
            <div className="py-4 flex justify-center">
              <img src={Iconblack} alt="logo" className="size-1/2" />
            </div>
          </div>
          <div className="md:col-span-7 col-span-12 text-theme-primary">
            <div className="p-8">
              <h2 className="text-xl text-theme-primary font-bold font-headingfont py-4">
                We are your favourite, online store.
              </h2>
              <p className="font-headingfont text-[13px] tracking-wide text-justify leading-[1.5]">
                We create and curate stunning designs and print them on all
                sorts of equally stunning products- from t-shirts to phone
                covers to backpacks to boxers to mugs to socks to badges to pins
                to hoodies and many, many more! Our funky products are designed
                and printed specifically to spread happiness, right down to the
                bottom of your ‘soul’. A recent study by our internal,
                self-funded, fashion forward (and totally unbiased) team showed
                that if you buy from www.thesouledstore.com, it increases your
                lifespan by 7.5%. So if you’re looking for great products, with
                even greater deals and discounts, you’ve come to the right
                place!
              </p>
            </div>
          </div>

          {/* section 2 end*/}

          {/* section 3 start*/}
          <div className="col-span-12 bg-theme-primary text-theme-secondary">
            <div className="p-8">
              <h2 className="text-xl text-center text-theme-secondary font-bold font-headingfont py-4">
                We are your favourite, online store.
              </h2>
              <div className="md:px-8 font-headingfont text-[13px] tracking-wide text-justify leading-[1.5]">
                <p className="py-4 md:px-8">
                  For starters, it makes for a great pun on the word ‘sold’,
                  since we ‘sell' stuff. Smart, right? But more importantly, The
                  Souled Store was born out of the idea of loving what you do -
                  “following your soul”. Our philosophy is that life is short.
                  Don’t spend it doing something you don’t like. There are too
                  many Monday mornings, and you can’t go dreading every single
                  one of them.
                </p>
                <p className="py-4 md:px-8">
                  We, at The Souled Store, love what we do- designs, products,
                  marketing, and everything in between. Our goal is to give
                  everyone something they'll love, something they can use to
                  express themselves, and, simply put, something to put a smile
                  on their face. So, whether it's superheroes, TV shows, pop
                  culture, music, sports, or quirky, funny stuff you're looking
                  for, we have something for everyone. Because each person is a
                  special snowflake (whether or not they believe it), and they
                  deserve only the most insane merchandise available out there!
                  So, if you relate to the feeling, and believe in following
                  one's heart (soul), hop along on this wonderful journey of
                  ours, and help us spread the love!
                </p>
              </div>
            </div>
          </div>

          {/* section 3 end*/}

          {/* section 4 start*/}
          <div className="col-span-12 text-theme-primary">
            <div className="p-8">
              <h2 className="text-xl text-center text-theme-primary font-bold font-headingfont py-4">
                The Team
              </h2>
              <div className="md:px-8 font-headingfont text-[13px] tracking-wide text-justify leading-[1.5]">
                <p className="py-4 md:px-8">
                  We’re a bunch of comic book loving, lame joke cracking, and
                  slightly weird but largely likeable people. We love what we
                  do, and don’t take ourselves too seriously. This company was
                  started by 4 people, with a cupboard full of clothes (probably
                  the size of your wardrobe). We’ve now grown to over 150
                  people, and graduated from cupboards to warehouses, but
                  really, that’s all that’s changed. We’re still childishly
                  excited about everything we do- from the random post-it wall,
                  to the unnecessary instructions outside the bathroom door, the
                  board game sessions, and the pot-luck lunches.
                </p>
                <p className="py-4 md:px-8">
                  And we try and ensure that this philosophy resonates with all
                  those who come and join our family. So, if you’re bored of
                  your current desk job and believe that ‘work’ does not
                  necessarily have to be a bad word, look no further. We’d love
                  to have you on our team!
                </p>
              </div>
            </div>
          </div>

          {/* section 4 end*/}

          {/* section 5 start */}
          <div className="col-span-12">
            <h2 className="text-2xl text-center text-theme-primary font-bold font-headingfont py-4">
              Testimonials By Our Products
            </h2>
            <hr />
          </div>

          {/* Testimonials 1 start */}
          <div className="md:col-span-4 col-span-12">
            <div className="py-4 flex justify-center">
              <img src={Tshit} alt="logo" className="size-1/2" />
            </div>
          </div>
          <div className="md:col-span-7 col-span-12  text-theme-primary">
            <div className="p-8">
              <h2 className="text-xl text-theme-primary font-bold font-headingfont py-4">
                T-Shirts
              </h2>
              <p className="font-headingfont text-[13px] tracking-wide text-justify leading-[1.5]">
                “The Souled Store and us go back a long way, and they’ve been
                great buddies throughout. They’ve constantly given us these
                amazing designer makeovers- adding pockets, using
                glow-in-the-dark inks, playing around with our colours,
                increasing sleeves, etc. We’ve now become so popular that we’re
                regularly mobbed in public, and even celebrities can’t seem to
                get enough of us. Our population is growing at a frantic pace,
                and we’ll soon accomplish our goal of being present in every
                house on this planet. If you’re lazy and prefer online shopping
                for your clothes, you know where to find us!” – Tim the T-shirt
              </p>
            </div>
          </div>
          <div className="col-span-12">
            <hr />
          </div>
          {/* Testimonials 1 end */}

          {/* Testimonials 2 start */}
          <div className="md:col-span-4 col-span-12">
            <div className="py-4 flex justify-center">
              <img src={PrintedTshit} alt="logo" className="size-1/2" />
            </div>
          </div>
          <div className="md:col-span-7 col-span-12  text-theme-primary">
            <div className="p-8">
              <h2 className="text-xl text-theme-primary font-bold font-headingfont py-4">
                T-Shirts
              </h2>
              <p className="font-headingfont text-[13px] tracking-wide text-justify leading-[1.5]">
                “The Souled Store and us go back a long way, and they’ve been
                great buddies throughout. They’ve constantly given us these
                amazing designer makeovers- adding pockets, using
                glow-in-the-dark inks, playing around with our colours,
                increasing sleeves, etc. We’ve now become so popular that we’re
                regularly mobbed in public, and even celebrities can’t seem to
                get enough of us. Our population is growing at a frantic pace,
                and we’ll soon accomplish our goal of being present in every
                house on this planet. If you’re lazy and prefer online shopping
                for your clothes, you know where to find us!” – Tim the T-shirt
              </p>
            </div>
          </div>
          <div className="col-span-12">
            <hr />
          </div>
          {/* Testimonials 2 end */}

          {/* Testimonials 3 start */}
          <div className="md:col-span-4 col-span-12">
            <div className="py-4 flex justify-center">
              <img src={Tshit} alt="logo" className="size-1/2" />
            </div>
          </div>
          <div className="md:col-span-7 col-span-12 text-theme-primary">
            <div className="p-8">
              <h2 className="text-xl text-theme-primary font-bold font-headingfont py-4">
                T-Shirts
              </h2>
              <p className="font-headingfont text-[13px] tracking-wide text-justify leading-[1.5]">
                “The Souled Store and us go back a long way, and they’ve been
                great buddies throughout. They’ve constantly given us these
                amazing designer makeovers- adding pockets, using
                glow-in-the-dark inks, playing around with our colours,
                increasing sleeves, etc. We’ve now become so popular that we’re
                regularly mobbed in public, and even celebrities can’t seem to
                get enough of us. Our population is growing at a frantic pace,
                and we’ll soon accomplish our goal of being present in every
                house on this planet. If you’re lazy and prefer online shopping
                for your clothes, you know where to find us!” – Tim the T-shirt
              </p>
            </div>
          </div>
          <div className="col-span-12">
            <hr />
          </div>
          {/* Testimonials 3 end */}
          {/* section 5 end */}
        </div>
      </div>

      {/* content end */}
    </>
  );
};

export default About;
