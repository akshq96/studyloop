import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { uploadMaterial } from "./api";
import Squiggle from "./Squiggle";
import FloatingIcons from "./FloatingIcons";
import HeroIllustration from "./HeroIllustration";

const FEATURES = [
  {
    label: "Adapts in real time",
    icon: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />,
  },
  {
    label: "Grounded in your notes",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="0.6" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: "Free to try",
    icon: <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4Z" />,
  },
];

const heroVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

const LENGTH_OPTIONS = [
  { rounds: 2, label: "Quick", hint: "~8-10 questions" },
  { rounds: 3, label: "Standard", hint: "~12-15 questions" },
  { rounds: 4, label: "Deep", hint: "~16-20 questions" },
];

const DIFFICULTY_OPTIONS = [
  { level: 1, label: "Easy", hint: "start gentle" },
  { level: 2, label: "Medium", hint: "balanced" },
  { level: 3, label: "Hard", hint: "jump right in" },
];

const SAMPLES = [
  {
    key: "biology-1",
    text: `Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy into chemical energy stored in glucose. It occurs primarily in the chloroplasts of plant cells, specifically using the green pigment chlorophyll. The overall reaction combines carbon dioxide and water, using light energy, to produce glucose and oxygen.

Photosynthesis has two main stages: the light-dependent reactions, which occur in the thylakoid membrane and produce ATP and NADPH while releasing oxygen as a byproduct, and the light-independent reactions (the Calvin cycle), which occur in the stroma and use ATP and NADPH to fix carbon dioxide into glucose.

Factors affecting the rate of photosynthesis include light intensity, carbon dioxide concentration, and temperature. At low light intensities, light is the limiting factor, but at high light intensities, other factors such as CO2 concentration become limiting instead.

Chlorophyll absorbs mostly red and blue light while reflecting green light, which is why plants appear green. There are two types of chlorophyll in most plants: chlorophyll a and chlorophyll b, which absorb slightly different wavelengths and work together to capture more of the light spectrum.`,
  },
  {
    key: "biology-2",
    text: `Cellular respiration is the metabolic process by which cells break down glucose in the presence of oxygen to release energy stored as ATP, adenosine triphosphate. It occurs primarily within the mitochondria, often called the powerhouse of the cell, and is essentially the reverse of photosynthesis in terms of its overall chemical equation.

The process consists of three main stages: glycolysis, the citric acid cycle (also called the Krebs cycle), and oxidative phosphorylation. Glycolysis takes place in the cytoplasm and splits one molecule of glucose into two molecules of pyruvate, producing a small net gain of ATP and NADH.

The pyruvate then enters the mitochondria, where it is converted into acetyl-CoA and fed into the citric acid cycle. This cycle generates additional NADH and FADH2, electron carriers that feed into the final stage.

During oxidative phosphorylation, NADH and FADH2 donate electrons to the electron transport chain embedded in the inner mitochondrial membrane. As electrons move through this chain, protons are pumped across the membrane, creating a gradient that drives ATP synthase to produce the majority of the cell's ATP. Oxygen serves as the final electron acceptor, combining with electrons and protons to form water.

In total, aerobic cellular respiration can yield up to 36 to 38 ATP molecules per glucose molecule, far more than anaerobic processes like fermentation.`,
  },
  {
    key: "history-1",
    text: `The French Revolution began in 1789 and fundamentally transformed France from an absolute monarchy into a republic governed by the principles of liberty, equality, and fraternity. Its causes included widespread famine and bread shortages, an inequitable taxation system that burdened the common people while nobility and clergy were largely exempt, and the influence of Enlightenment ideas that questioned the divine right of kings.

The Revolution unfolded in several phases. It began with the storming of the Bastille on July 14, 1789, a symbol of royal tyranny. The National Assembly then adopted the Declaration of the Rights of Man and of the Citizen, establishing individual liberties as a foundation of law. The monarchy was abolished in 1792, and King Louis XVI was executed by guillotine in January 1793.

The Reign of Terror, led by Maximilien Robespierre and the Committee of Public Safety, followed between 1793 and 1794. During this period, tens of thousands of perceived enemies of the Revolution were executed. Robespierre himself was eventually arrested and executed, ending the Terror.

The Revolution concluded with the rise of Napoleon Bonaparte, who seized power in a coup in 1799 and later crowned himself Emperor in 1804, effectively ending the revolutionary republic while preserving many of its legal and social reforms, such as the Napoleonic Code.`,
  },
  {
    key: "history-2",
    text: `The Cold War was a prolonged period of geopolitical tension between the United States and the Soviet Union, lasting roughly from 1947 to 1991. Unlike a traditional war, it was characterized by political rivalry, proxy conflicts, espionage, and an arms race rather than direct large-scale military combat between the two superpowers.

The conflict emerged from ideological differences: the United States championed capitalism and democracy, while the Soviet Union promoted communism and a single-party state. Europe was effectively divided, with Western nations aligning with the United States through NATO, formed in 1949, and Eastern nations aligning with the Soviet Union through the Warsaw Pact, formed in 1955.

Key events included the Berlin Blockade and Airlift of 1948-1949, the Cuban Missile Crisis of 1962, which brought the world close to nuclear war, and the ongoing nuclear arms race, which led both nations to stockpile thousands of nuclear warheads under the doctrine of mutually assured destruction.

The Cold War also played out through proxy wars in Korea, Vietnam, and Afghanistan, where the superpowers supported opposing sides without engaging each other directly. It also spurred the Space Race, culminating in the American moon landing in 1969.

The Cold War ended with the collapse of the Soviet Union in 1991, following economic stagnation and political reforms introduced by Mikhail Gorbachev, known as glasnost and perestroika.`,
  },
  {
    key: "cs-1",
    text: `The Internet is a global network of interconnected computers that communicate using a standardized set of protocols. When you visit a website, your device sends a request that travels through several layers of infrastructure before reaching its destination.

First, your browser needs to translate a human-readable domain name, such as example.com, into a numerical IP address. This is done through the Domain Name System (DNS), which acts like a phone book for the Internet, mapping domain names to IP addresses.

Once the IP address is known, data is broken into small units called packets. Each packet travels independently across the network, potentially through different routes, guided by devices called routers that read the destination address and forward the packet toward it. This packet-based approach, defined by the Internet Protocol (IP), allows the network to be resilient — if one path is congested or broken, packets can be rerouted.

The Transmission Control Protocol (TCP) works alongside IP to ensure that packets arrive reliably and in the correct order, resending any that are lost. Together, these are referred to as TCP/IP, the foundational protocol suite of the Internet.

Finally, when a packet reaches a web server, the server processes the request — typically using HTTP or HTTPS, the protocols for transferring web content — and sends the requested data back to your browser, which assembles the packets and renders the webpage.`,
  },
  {
    key: "cs-2",
    text: `Big-O notation is a mathematical notation used in computer science to describe the efficiency of an algorithm in terms of how its runtime or memory usage grows as the size of its input increases. It focuses on the worst-case scenario and ignores constant factors, allowing developers to compare algorithms independent of hardware or implementation details.

Common complexity classes, ordered from most to least efficient, include O(1), constant time, where the operation takes the same amount of time regardless of input size, such as accessing an array element by index. O(log n), logarithmic time, typical of algorithms like binary search that repeatedly halve the problem size.

O(n), linear time, where runtime grows proportionally with input size, such as scanning through a list once. O(n log n), typical of efficient sorting algorithms like merge sort and quicksort. O(n squared), quadratic time, common in algorithms with nested loops over the same data, such as bubble sort. And O(2^n), exponential time, often seen in brute-force recursive algorithms that explore all possible combinations.

Understanding Big-O helps engineers choose the right algorithm for a given problem. For example, a linear search through an unsorted list is O(n), but if the list is sorted, binary search can find an element in O(log n) time instead, a dramatic improvement for large datasets.

Big-O notation also applies to space complexity, describing how much additional memory an algorithm requires as input size grows, which is an important consideration alongside time efficiency.`,
  },
  {
    key: "psychology-1",
    text: `Classical conditioning is a learning process discovered by Russian physiologist Ivan Pavlov in the early 1900s, in which a neutral stimulus becomes associated with a meaningful stimulus, eventually triggering a similar response on its own.

Pavlov's original experiments involved dogs. He noticed that dogs would naturally salivate, an unconditioned response, when presented with food, the unconditioned stimulus. Pavlov then began ringing a bell, a neutral stimulus, just before presenting food. After repeated pairings, the dogs began to salivate at the sound of the bell alone, even without food present. The bell had become a conditioned stimulus, and salivation in response to it became a conditioned response.

This process involves several key stages: acquisition, when the association between stimuli is first formed; extinction, when the conditioned response weakens if the conditioned stimulus is repeatedly presented without the unconditioned stimulus; and spontaneous recovery, when a previously extinguished response reappears after a period of rest.

Classical conditioning also demonstrates stimulus generalization, where stimuli similar to the conditioned stimulus can trigger the same response, and stimulus discrimination, where an organism learns to distinguish between similar stimuli and respond only to the specific conditioned one.

This principle has since been applied broadly, including in understanding phobias, taste aversions, and certain forms of behavioral therapy such as systematic desensitization.`,
  },
  {
    key: "psychology-2",
    text: `Maslow's Hierarchy of Needs is a psychological theory proposed by Abraham Maslow in 1943, presented as a five-tier pyramid describing the stages of human motivation. The theory suggests that people must satisfy lower-level needs before they are motivated to pursue higher-level ones.

At the base of the pyramid are physiological needs, the most fundamental requirements for survival, including food, water, warmth, and rest. Above this are safety needs, which include personal security, employment, health, and protection from harm.

The third tier consists of love and belonging needs, encompassing friendship, intimacy, family connections, and a sense of social community. The fourth tier is esteem needs, which include self-respect, recognition, status, and a sense of accomplishment.

At the top of the pyramid is self-actualization, the desire to realize one's full potential, pursue personal growth, and engage in creative or meaningful pursuits. Maslow described self-actualized individuals as those who had achieved a strong sense of purpose and fulfillment.

Later in his career, Maslow expanded the model to include additional levels, such as cognitive needs, the desire for knowledge and understanding, and aesthetic needs, an appreciation for beauty and order, positioned between esteem and self-actualization.

While influential, the theory has been criticized for lacking strong empirical support and for assuming a rigid, universal order in which needs must be satisfied, which does not always reflect real human behavior across different cultures.`,
  },
];

function shuffledSampleKeys(excludeKey) {
  const keys = SAMPLES.map((s) => s.key);
  for (let i = keys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [keys[i], keys[j]] = [keys[j], keys[i]];
  }
  // avoid showing the same sample twice in a row across a reshuffle boundary
  if (excludeKey && keys[0] === excludeKey && keys.length > 1) {
    const swapIdx = 1 + Math.floor(Math.random() * (keys.length - 1));
    [keys[0], keys[swapIdx]] = [keys[swapIdx], keys[0]];
  }
  return keys;
}

export default function UploadScreen({ onReady }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [rounds, setRounds] = useState(3);
  const [startLevel, setStartLevel] = useState(2);
  const [loading, setLoading] = useState(false);
  const [slowStart, setSlowStart] = useState(false);
  const [error, setError] = useState("");
  const sampleQueue = useRef([]);
  const lastSampleKey = useRef(null);

  function handleTrySample() {
    if (sampleQueue.current.length === 0) {
      sampleQueue.current = shuffledSampleKeys(lastSampleKey.current);
    }
    const key = sampleQueue.current.shift();
    lastSampleKey.current = key;
    setError("");
    setFile(null); // a file, if any, would otherwise silently win over this sample text
    setText(SAMPLES.find((s) => s.key === key).text);
  }

  function handleFileChange(e) {
    const picked = e.target.files[0] || null;
    setError("");
    setFile(picked);
    if (picked) setText(""); // avoid ambiguity about which source actually gets submitted
  }

  function handleTextChange(e) {
    setText(e.target.value);
    if (file) setFile(null); // typing means they want the pasted text, not the old file
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!file && text.trim().length < 200) {
      setError("Paste at least a few paragraphs, or upload a PDF/text file.");
      return;
    }
    setLoading(true);
    const slowTimer = setTimeout(() => setSlowStart(true), 4000);
    try {
      const data = await uploadMaterial({
        file,
        text,
        roundsPerConcept: rounds,
        startLevel,
      });
      onReady(data);
    } catch (err) {
      setError(err.message);
    } finally {
      clearTimeout(slowTimer);
      setSlowStart(false);
      setLoading(false);
    }
  }

  return (
    <div className="screen screen-wide">
      <FloatingIcons />
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
      >
        <div className="hero-grid">
          <div className="hero-block">
            <motion.span variants={heroVariants} className="pill-badge">
              <span className="pill-badge-spark">✨</span> AI-powered diagnostic quizzes
            </motion.span>
            <motion.h1 variants={heroVariants} className="hero-title">
              Turn your notes into a quiz that
              <span className="hero-title-line2">
                {" "}
                <span className="accent-word gradient-live">adapts to you</span>
                <Squiggle width={230} />
              </span>
            </motion.h1>
            <motion.p variants={heroVariants} className="subtitle">
              Upload your notes and get an AI-generated diagnostic quiz that gets harder
              on what you know and easier on what you don't — grounded in your own
              material, not generic questions.
            </motion.p>

            <motion.div variants={heroVariants} className="feature-chips">
              {FEATURES.map((f) => (
                <span key={f.label} className="feature-chip">
                  <span className="feature-chip-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {f.icon}
                    </svg>
                  </span>
                  {f.label}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div variants={heroVariants} className="hero-illustration-slot">
            <HeroIllustration />
          </motion.div>
        </div>

        <motion.form variants={heroVariants} onSubmit={handleSubmit} className="upload-form card">
        <label className="field">
          <span className="field-label"><span className="field-number">1</span>Add your study material</span>
          <div className="file-drop">
            <input
              type="file"
              accept=".pdf,.txt,.md"
              onChange={handleFileChange}
            />
            <div className="file-drop-label">
              {file ? (
                <strong>{file.name}</strong>
              ) : (
                <>Drop a PDF or text file here, or <strong>click to browse</strong></>
              )}
            </div>
          </div>

          <div className="divider">or paste it in</div>

          <div className="field-label-row">
            <span className="field-label field-label-inline">Paste your notes</span>
            <button type="button" className="sample-chip" onClick={handleTrySample}>
              🎲 Try a sample
            </button>
          </div>
          <textarea
            rows={9}
            placeholder="Paste lecture notes, a textbook excerpt, etc."
            value={text}
            onChange={handleTextChange}
          />
        </label>

        <label className="field">
          <span className="field-label"><span className="field-number">2</span>Quiz length</span>
          <div className="length-picker">
            {LENGTH_OPTIONS.map((opt) => (
              <button
                key={opt.rounds}
                type="button"
                className={`length-option ${rounds === opt.rounds ? "length-option-active" : ""}`}
                onClick={() => setRounds(opt.rounds)}
              >
                <strong>{opt.label}</strong>
                <span>{opt.hint}</span>
              </button>
            ))}
          </div>
        </label>

        <label className="field">
          <span className="field-label"><span className="field-number">3</span>Starting difficulty</span>
          <div className="length-picker">
            {DIFFICULTY_OPTIONS.map((opt) => (
              <button
                key={opt.level}
                type="button"
                className={`length-option ${startLevel === opt.level ? "length-option-active" : ""}`}
                onClick={() => setStartLevel(opt.level)}
              >
                <strong>{opt.label}</strong>
                <span>{opt.hint}</span>
              </button>
            ))}
          </div>
        </label>

        {error && <div className="error">{error}</div>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading
            ? slowStart
              ? "Waking up the server… free hosting naps after inactivity, up to ~50s"
              : "Analyzing material…"
            : "Generate diagnostic quiz"}
        </button>
        <p className="trust-line">Your notes stay in memory for this session only — nothing is stored.</p>
        </motion.form>
      </motion.div>
    </div>
  );
}
